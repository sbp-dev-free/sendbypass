import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavLinkProps } from './types';
import { Icon } from 'react-native-paper';
import { Colors } from '@/constants/Colors';

const NavLink = ({ item, onPress }: NavLinkProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.left}>
        <Icon size={24} source={item.icon} color={Colors.onSurface} />
        <Text>{item.title}</Text>
      </View>
      <Icon source="chevron-right" size={16} color={Colors.onSurface} />
    </TouchableOpacity>
  );
};

export default NavLink;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    color: Colors.onSurface,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 400,
  },
});
