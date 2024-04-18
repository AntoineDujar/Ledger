import { Tabs } from 'expo-router';

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name='index'
        options={{
          headerTitle: 'Home',
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name='user/index'
        options={{
          headerTitle: 'User',
          title: 'User',
        }}
      />
      <Tabs.Screen
        name='buttonEdit'
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
