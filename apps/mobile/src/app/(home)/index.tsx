import { useRouter, router } from 'expo-router';
import { Button, StyleSheet, Text, View, Image, ScrollView, RefreshControl } from "react-native";
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

// API
import { useUserParties } from '@/api/queries';

// components
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import TitleText from '@/components/ui/TitleText';

import PartyItem from '@/components/board/PartyItem';
import InviteItem from '@/components/board/InviteItem';

export default function BoardScreen() {
  // TODO: Replace with actual userId from auth context
  // const userId = 'cmwbfo5fx0001ydb60d11maix';
  const userId = 'cmwcrr2nr0000vcb6yr1ds4f2';

  // Fetch user parties with React Query
  const { 
    data, 
    isLoading, 
    error, 
    refetch,
    isRefetching 
  } = useUserParties(userId);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const goToParty = (partyId: string, isOrganizer: boolean) => {
    router.push(`/${isOrganizer ? 'overview' : 'party'}/${partyId}`)
  }

  const goToInvite = (id: string) => {
    router.push(`/invite/${id}`)
  }

  // Separate parties by role
  const guestParties = data?.parties.filter(p => p.userRole === 'GUEST') ?? [];
  const operatorParties = data?.parties.filter(p => p.userRole === 'OPERATOR') ?? [];



  // Show loading state on initial load
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <LoadingIndicator />
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Failed to load parties</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ width: '100%', gap: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => { refetch(); }}
          />
        }
      >
        {/* YOUR PARTIES (Guest Role) */}
        {guestParties.length > 0 && (
          <>
            <View style={styles.sectionLabelContainer}>
              <Text style={{ fontWeight: '500' }}>your parties</Text>
            </View>
            <View style={styles.itemContainer}>
              {guestParties.map((party, index) => (
                <PartyItem
                  key={party.id}
                  title={party.name}
                  message={`${party.participantCount} participant${party.participantCount !== 1 ? 's' : ''}`}
                  onPress={() => goToParty(party.id, false)}
                  backgroundColor={index % 2 === 0 ? undefined : '#FF87DF'}
                  sampleImageIndex={index % 3}
                />
              ))}
            </View>
          </>
        )}

        {/* OPERATOR PARTIES */}
        {operatorParties.length > 0 && (
          <>
            <View style={styles.sectionLabelContainer}>
              <Text style={{ fontWeight: '500' }}>operator</Text>
            </View>
            <View style={styles.itemContainer}>
              {operatorParties.map((party, index) => (
                <PartyItem
                  key={party.id}
                  title={party.name}
                  onPress={() => goToParty(party.id, true)}
                  backgroundColor={'gray'}
                  sampleImageIndex={2}
                  imageOpacity={.8}
                  type={'OPERATOR'}
                />
              ))}
            </View>
          </>
        )}

        {/* Empty State */}
        {guestParties.length === 0 && operatorParties.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No parties yet</Text>
            <Text style={styles.emptySubtext}>Create or join a party to get started!</Text>
          </View>
        )}

        {/* INVITES - Keeping the mock data for now */}
        {/* <View style={styles.sectionLabelContainer}>
          <Text style={{ fontWeight: '500' }}>invites</Text>
        </View>
        <View style={styles.itemContainer}>
          <InviteItem
            onPress={() => goToInvite('swag')}
            title='EDC'
            from='INSOMNIAC EVENTS'
            message='xoxo.'
            sealColor='#FF87DF'
          />
          <InviteItem
            onPress={() => goToInvite('swag')}
            title='Herbie Hancock'
            from='H.H.'
            message=''
            sealColor='#84FF32'
          />
        </View> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  centered: {
    justifyContent: 'center',
  },
  itemContainer: {
    gap: 10,
  },
  sectionLabelContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});
