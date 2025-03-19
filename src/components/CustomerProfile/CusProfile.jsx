import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { BadgeDollarSign, MapPinHouse, NotebookPen, Star, UserRoundPen, Wallet } from 'lucide-react';

const CusProfile = ({ selectedMenu, setSelectedMenu, profileInfo}) => {
  return (
    <Card className="w-full relative z-[0] ">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/path/to/avatar.png" />
            <AvatarFallback>DU</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{profileInfo.data.full_name}</CardTitle>
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
                className={`flex text-sm justify-start it ${
                  selectedMenu === 'profile' ? 'text-primary font-semibold' : ''
                }`}
              >
                &nbsp;<UserRoundPen/>
                Profile
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#wallet"
                onClick={() => setSelectedMenu('wallet')}
                className={`flex text-sm justify-start it ${
                  selectedMenu === 'wallet' ? 'text-primary font-semibold' : ''
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
                className={`flex text-sm justify-start it ${
                  selectedMenu === 'transactions' ? 'text-primary font-semibold' : ''
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
                className={`flex text-sm justify-start it ${
                  selectedMenu === 'address' ? 'text-primary font-semibold' : ''
                }`}
              >
                <MapPinHouse />
                Address
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#booking"
                onClick={() => setSelectedMenu('booking')}
                className={`flex text-sm justify-start it ${
                  selectedMenu === 'booking' ? 'text-primary font-semibold' : ''
                }`}
              >
                <NotebookPen />
                Booking
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#rating"
                onClick={() => setSelectedMenu('rating')}
                className={`flex text-sm justify-start it ${
                  selectedMenu === 'rating' ? 'text-primary font-semibold' : ''
                }`}
              >
                <Star/>
                Rating
              </NavigationMenuLink>
            </NavigationMenuItem>
            {/* Add more menu items here */}
          </NavigationMenuList>
        </NavigationMenu>
      </CardContent>
    </Card>
  );
};

export default CusProfile;