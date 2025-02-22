import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { BadgeDollarSign, MapPinHouse, UserRoundPen, Wallet } from 'lucide-react';

const CusProfile = ({ selectedMenu, setSelectedMenu }) => {
  return (
    <Card className="w-full relative z-[0] ">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/path/to/avatar.png" />
            <AvatarFallback>DU</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Demo User</CardTitle>
            <CardDescription>Member Since Dec 2024</CardDescription>
          </div>
        </div>
      </CardHeader>
      <Separator className="my-4" />
      <CardContent>
        <NavigationMenu>
          <NavigationMenuList className="flex flex-col justify-start items-start space-y-6">
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#profile"
                onClick={() => setSelectedMenu('profile')}
                className={`flex text-sm ${
                  selectedMenu === 'profile' ? 'text-blue-500 font-semibold' : 'text-gray-700'
                }`}
              >
                <UserRoundPen/>
                Profile
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#wallet"
                onClick={() => setSelectedMenu('wallet')}
                className={`flex text-sm ${
                  selectedMenu === 'wallet' ? 'text-blue-500 font-semibold' : 'text-gray-700'
                }`}
              >
                <Wallet />
                Wallet
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#transactions"
                onClick={() => setSelectedMenu('transactions')}
                className={`flex text-sm ${
                  selectedMenu === 'transactions' ? 'text-blue-500 font-semibold' : 'text-gray-700'
                }`}
              >
                <BadgeDollarSign />
                Transactions
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#address"
                onClick={() => setSelectedMenu('address')}
                className={`flex text-sm ${
                  selectedMenu === 'address' ? 'text-blue-500 font-semibold' : 'text-gray-700'
                }`}
              >
                <MapPinHouse />
                Address
              </NavigationMenuLink>
            </NavigationMenuItem>
            {/* Add more menu items here */}
          </NavigationMenuList>
        </NavigationMenu>
      </CardContent>
      <Separator className="my-4" />
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">Settings</h3>
        <NavigationMenu>
          <NavigationMenuList className="flex flex-col space-y-2">
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#profile-settings"
                onClick={() => setSelectedMenu('profile-settings')}
                className={`text-sm ${
                  selectedMenu === 'profile-settings' ? 'text-blue-500 font-semibold' : 'text-gray-700'
                }`}
              >
                Profile Settings
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#security-settings"
                onClick={() => setSelectedMenu('security-settings')}
                className={`text-sm ${
                  selectedMenu === 'security-settings' ? 'text-blue-500 font-semibold' : 'text-gray-700'
                }`}
              >
                Security Settings
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#delete-account"
                onClick={() => setSelectedMenu('delete-account')}
                className={`text-sm ${
                  selectedMenu === 'delete-account' ? 'text-blue-500 font-semibold' : 'text-gray-700'
                }`}
              >
                Delete Account
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="destructive">Logout</Button>
      </CardFooter>
    </Card>
  );
};

export default CusProfile;