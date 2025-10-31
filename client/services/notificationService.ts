import { supabase } from "../../src/integrations/supabase/client";

export interface Notification {
  id: string;
  user_id: string;
  clinic_id: string | null;
  title: string;
  message: string | null;
  type: string;
  related_type: string | null;
  related_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  clinic_id: string;
  assigned_to: string;
  created_by: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export const NotificationService = {
  // Get notifications for current user
  async getUserNotifications(clinicId?: string): Promise<Notification[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (clinicId) {
      query = query.eq('clinic_id', clinicId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    return data || [];
  },

  // Get unread count
  async getUnreadCount(clinicId?: string): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    let query = supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (clinicId) {
      query = query.eq('clinic_id', clinicId);
    }

    const { count, error } = await query;

    if (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }

    return count || 0;
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }

    return true;
  },

  // Mark all notifications as read
  async markAllAsRead(clinicId?: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    let query = supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (clinicId) {
      query = query.eq('clinic_id', clinicId);
    }

    const { error } = await query;

    if (error) {
      console.error('Error marking all as read:', error);
      return false;
    }

    return true;
  },

  // Create a notification
  async createNotification(notification: {
    user_id: string;
    clinic_id?: string;
    title: string;
    message?: string;
    type: string;
    related_type?: string;
    related_id?: string;
  }): Promise<Notification | null> {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        ...notification,
        clinic_id: notification.clinic_id || null,
        message: notification.message || null,
        related_type: notification.related_type || null,
        related_id: notification.related_id || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return null;
    }

    return data;
  },

  // Subscribe to real-time notifications
  subscribeToNotifications(
    userId: string,
    callback: (notification: Notification) => void
  ) {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};

export const MessageService = {
  // Get unread messages count
  async getUnreadCount(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    // Get conversations where user is participant
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .contains('participant_ids', [user.id]);

    if (convError || !conversations) return 0;

    const conversationIds = conversations.map(c => c.id);

    // Get unread messages in those conversations
    const { count, error } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .in('conversation_id', conversationIds)
      .eq('is_read', false)
      .neq('sender_id', user.id);

    if (error) {
      console.error('Error fetching unread messages count:', error);
      return 0;
    }

    return count || 0;
  },

  // Subscribe to real-time messages
  subscribeToMessages(
    conversationId: string,
    callback: (message: Message) => void
  ) {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
