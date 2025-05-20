import React from 'react';
import { Calendar, Edit, Check, X } from 'lucide-react';

const DaysSection = ({
  profile,
  setProfile,
  editMode,
  setEditMode,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  EditButtons,
  days
}) => {
  const toggleDay = (day) => {
    const newDays = profile.workingDays.includes(day)
      ? profile.workingDays.filter(d => d !== day)
      : [...profile.workingDays, day];
    setProfile(prev => ({ ...prev, workingDays: newDays }));
  };
  return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-accent" />
            <CardTitle className="text-primary dark:text-white">Working Days</CardTitle>
          </div>
          <button
              onClick={() => setEditMode(prev => ({ ...prev, workingDays: !prev.workingDays }))}
              className="p-2 hover:bg-light/20 dark:hover:bg-gray-700 rounded-full"
          >
            <Edit className="w-4 h-4 text-accent" />
          </button>
        </CardHeader>

        <CardContent className="p-4">
          {editMode.workingDays ? (
              <div className="space-y-4">
                <div className="grid gap-3">
                  {days.map(day => (
                      <div
                          key={day}
                          className="flex items-center justify-between p-3 rounded-lg border border-secondary bg-light/50 dark:bg-gray-900/50"
                      >
                        <span className="font-medium text-secondary dark:text-gray-200">{day}</span>
                        <button
                            onClick={() => toggleDay(day)}
                            className={`p-2 rounded-full  ${
                                profile.workingDays.includes(day)
                                    ? 'bg-light/50 text-accent ring ring-accent'
                                    : 'bg-light/50 text-secondary ring ring-red-500 dark:text-gray-400'
                            }`}
                        >
                          {profile.workingDays.includes(day) ? (
                              <Check className="w-4 h-4" />
                          ) : (
                              <X className="w-4 h-4 text-red-500" />
                          )}
                        </button>
                      </div>
                  ))}
                </div>
                <EditButtons section="workingDays" />
              </div>
          ) : (
              <div className="flex flex-wrap gap-2">
                {profile.workingDays?.map((day, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-light/50 dark:bg-gray-800 text-accent"
                    >
                {day}
              </span>
                ))}
                {profile.workingDays?.length === 0 && (
                    <span className="text-secondary dark:text-gray-400">
                No working days selected
              </span>
                )}
              </div>
          )}
        </CardContent>
      </Card>
  );
};

export default DaysSection;