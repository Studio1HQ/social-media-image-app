
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type DatabaseChangesEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface SubscriptionOptions {
  schema?: string;
  table: string;
  event?: DatabaseChangesEvent | DatabaseChangesEvent[];
  filter?: string;
}

export function useRealtimeSubscription<T = any>(
  options: SubscriptionOptions,
  callback: (payload: RealtimePostgresChangesPayload<T>) => void
) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const { schema = 'public', table, event = '*', filter } = options;

    // Create channel for real-time updates
    let channelName = `${schema}:${table}:${typeof event === 'string' ? event : event.join(',')}`;
    if (filter) {
      channelName += `:${filter}`;
    }

    // Subscribe to changes
    const realtimeChannel = supabase.channel(channelName)
      .on(
        'postgres_changes' as any, // Type assertion to avoid type error
        {
          event: event === '*' ? undefined : event,
          schema,
          table,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    setChannel(realtimeChannel);

    // Cleanup subscription on unmount
    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [options.schema, options.table, options.event, options.filter, callback]);

  return channel;
}
