import { useRouter, router } from 'expo-router';
import { Button, StyleSheet, Text, View, Image, ScrollView } from "react-native";

// components
import TitleText from '@/components/ui/TitleText';
import PartyItem from '@/components/board/PartyItem';
import InviteItem from '@/components/board/InviteItem';

export default function BoardScreen() {

  const goToParty = (admin: boolean) => {
    router.push(`/${admin ? 'overview' : 'party'}/${'6I_id81e8D'}`)
  }

  const goToInvite = (id: string) => {
    router.push(`/invite/${id}`)
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ width: '100%', gap: 10, }}
      >
        {/* YOUR PARTIES */}
        <View style={styles.sectionLabelContainer}>
          <Text
            style={{ fontWeight: '500' }}
          >Your Parties</Text>
        </View>
        <View style={styles.itemContainer}>
          <PartyItem
            title='TAME IMPALA'
            message='Join the fun. Get groovin.'
            onPress={() => goToParty(false)}
          />
          <PartyItem
            title='ALT-J'
            message='Join the goob. Get goobin.'
            onPress={() => goToParty(false)}
            backgroundColor={'#FF87DF'}
            sampleImageIndex={0}
          />
        </View>
        {/* <Button
          title='Go to party organizer view'
          onPress={() => goToParty(true)}
        /> */}
        <View style={styles.sectionLabelContainer}>
          <Text
            style={{ fontWeight: '500' }}
          >Operator</Text>
        </View>
        <View style={styles.itemContainer}>
          <PartyItem
            title='Alex G'
            onPress={() => goToParty(true)}
            backgroundColor={'gray'}
            sampleImageIndex={2}
            imageOpacity={.5}
          />
        </View>

        {/* INVITES */}
        <View style={styles.sectionLabelContainer}>
          <Text
            style={{ fontWeight: '500' }}
          >invites</Text>
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
        </View>
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
  itemContainer: {
    gap: 10,
  },
  sectionLabelContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  }
});
