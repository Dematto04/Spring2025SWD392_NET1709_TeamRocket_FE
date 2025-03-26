import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin } from 'lucide-react';

function ServiceDistanceRule({ data }) {
  const rules = data?.data?.rules || [];

  return (
    <Card className="w-full mt-8 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-900">
      <CardHeader className="bg-blue-50 dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Distance-based Fees
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Additional charges based on travel distance
        </p>
      </CardHeader>
      <CardContent className="p-6">
        {rules.length > 0 ? (
          <ul className="space-y-4">
            {rules.map((rule, index) => (
              <li key={`${rule.min}-${rule.max}`}>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {`${rule.min} - ${rule.max} km`}
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
                    ${rule.fee}
                  </span>
                </div>
                {index < rules.length - 1 && (
                  <Separator className="my-2 bg-gray-200 dark:bg-gray-700" />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">
            No distance-based fees apply.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default ServiceDistanceRule;