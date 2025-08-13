import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/authContext';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

const Profile = () => {
  const {
    state: { profile },
  } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        {profile?.image ? (
          <Image
            source={{ uri: profile.image }}
            width={40}
            height={40}
            resizeMode="contain"
          />
        ) : (
          <Icon
            source="account-outline"
            size={26}
            color={Colors.outline}
          ></Icon>
        )}
      </View>
      <View>
        <Text style={styles.TextTitle}>
          {profile?.firstName + ' ' + profile?.lastName}
        </Text>
        <Text style={styles.TextSubtitle}>{profile?.email}</Text>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface.container_high,
    marginBottom: 8,
  },
  profileImageContainer: {
    borderWidth: 2,
    borderRadius: '100%',
    borderColor: Colors.outline_variant,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  TextTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
    color: Colors.onSurface,
  },
  TextSubtitle: {
    fontSize: 12,
    color: Colors.onSurface_variant,
    fontWeight: 500,
    lineHeight: 16,
  },
});
