import { Colors } from '@/constants/Colors';
import {
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import logo from '@/assets/images/logo.png';
import { useAuth } from '@/context/authContext';
import { Icon } from 'react-native-paper';
import { HeaderProps } from './types';

const Header = ({ handleToggleBottomSheet }: HeaderProps) => {
  const {
    state: { profile },
  } = useAuth();

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <TouchableOpacity onPress={() => handleToggleBottomSheet(true)}>
        <View style={styles.profile}>
          {profile?.image ? (
            <Image
              source={{ uri: profile.image }}
              width={32}
              height={32}
              resizeMode="contain"
            />
          ) : (
            <Icon size={24} source="account-outline" color={Colors.onSurface} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 65,
    backgroundColor: Colors.surface.container,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 166,
    height: '100%',
  },
  profile: {
    width: 32,
    height: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.outline_variant,
    backgroundColor: Colors.surface.container_lowest,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
