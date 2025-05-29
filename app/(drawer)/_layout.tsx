import { useThemeColor } from '@/hooks/useThemeColor';
import AppDrawer from '@/src/drawer/AppDrawer';
import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  const headerBackground = useThemeColor('headerBackground');
  const headerTint = useThemeColor('headerTint');

  return (
    <Drawer
      drawerContent={(props) => <AppDrawer />}
      screenOptions={{
        headerTransparent: true,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: headerBackground,
        },
        headerTintColor: headerTint,
      }}
    >
      <Drawer.Screen/>
    </Drawer>
  );
}