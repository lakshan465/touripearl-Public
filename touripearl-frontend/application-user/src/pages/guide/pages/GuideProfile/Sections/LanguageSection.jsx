import React from 'react';
import { Edit, Languages, Plus, X } from 'lucide-react';

const LanguageSection = ({
  profile,
  setEditMode,
  editMode,
  proficiencyLevels,
  handleInputChange,
  newLanguage,
  setNewLanguage,
  handleAddLanguage,
  EditButtons,
  Card,
  CardHeader,
  CardTitle,
  CardContent
}) => {
  return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
          <CardTitle className="text-primary dark:text-white">Languages</CardTitle>
          <button
              onClick={() => setEditMode(prev => ({ ...prev, languages: !prev.languages }))}
              className="rounded-full p-2 hover:bg-light/20 dark:hover:bg-gray-700 transition-colors"
          >
            <Edit className="h-4 w-4 text-accent" />
          </button>
        </CardHeader>
        <CardContent className="p-4">
          {editMode.languages ? (
              <div className="space-y-6">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                      type="text"
                      placeholder="Language name"
                      value={newLanguage.name}
                      onChange={(e) => setNewLanguage(prev => ({ ...prev, name: e.target.value }))}
                      className="flex-1 rounded-md border border-secondary px-3 py-2 bg-light/50 dark:bg-gray-900/50 text-secondary dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-highlight"
                  />
                  <select
                      value={newLanguage.level}
                      onChange={(e) => setNewLanguage(prev => ({ ...prev, level: e.target.value }))}
                      className="rounded-md border border-secondary px-3 py-2 bg-light/50 dark:bg-gray-900/50 text-secondary dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-highlight"
                  >
                    <option value="">Select Level</option>
                    {proficiencyLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <button
                    onClick={handleAddLanguage}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2 text-white" />
                  Add
                </button>

                <div className="space-y-2">
                  {profile.guideLanguages?.map((language, index) => (
                      <div
                          key={index}
                          className="flex items-center justify-between rounded-lg bg-light/50 dark:bg-gray-900/50 p-3"
                      >
                  <span className="font-medium text-secondary dark:text-gray-200">
                    {language.languageName} - {language.languageLevel}
                  </span>
                        <button
                            onClick={() => {
                              const newLang = profile.guideLanguages.filter((_, i) => i !== index);
                              handleInputChange('guideLanguages', newLang);
                            }}
                            className="rounded-full p-1 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                  ))}
                </div>

                <EditButtons section="languages" />
              </div>
          ) : (
              <div className="flex items-start space-x-4">
                <Languages className="h-5 w-5 text-accent mt-1" />
                <div className="flex flex-wrap gap-2">
                  {profile.guideLanguages?.map((language, index) => (
                      <div
                          key={index}
                          className="rounded-full bg-light/50 dark:bg-gray-800 px-3 py-1.5 text-sm font-medium text-accent"
                      >
                        {language.languageName} - {language.languageLevel}
                      </div>
                  ))}
                </div>
              </div>
          )}
        </CardContent>
      </Card>
  );
};

export default LanguageSection;