import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
    CardTitle,
  } from "../../../../../components/card/Card.jsx";
  
  export const Card2 = ({ title, msg, handleSave, handleCancel, icon }) => {
      return (
          <div className="relative">
              {/* Background Blur */}
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-10"></div>

              {/* Floating Card */}
              <div className="fixed inset-0 flex items-center justify-center z-20">
                  <div className="w-full max-w-sm p-4 bg-light dark:bg-gray-900 rounded-md shadow-md">
                      <Card hoverable className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80">
                          <CardHeader>
                              <div className="flex flex-col items-center">
                                  {/* SVG Icon */}
                                  {icon ? (
                                      <svg
                                          className="text-highlight dark:text-yellow-500 w-10 h-10 mb-2"
                                          aria-hidden="true"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                          xmlns="http://www.w3.org/2000/svg"
                                      >
                                          <path
                                              fillRule="evenodd"
                                              d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.518 11.597c.76 1.352-.193 3.044-1.742 3.044H3.48c-1.55 0-2.502-1.692-1.742-3.044L8.257 3.1zm.743 12a1 1 0 112 0 1 1 0 01-2 0zm.25-4a.75.75 0 001.5 0v-3a.75.75 0 10-1.5 0v3z"
                                              clipRule="evenodd"
                                          ></path>
                                      </svg>
                                  ) : (
                                      <svg
                                          className="text-red-500 dark:text-red-600 w-10 h-10 mb-2"
                                          aria-hidden="true"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                          xmlns="http://www.w3.org/2000/svg"
                                      >
                                          <path
                                              fillRule="evenodd"
                                              d="M6 8a1 1 0 011-1h6a1 1 0 011 1v7a2 2 0 01-2 2H8a2 2 0 01-2-2V8zm3 3a1 1 0 10-2 0v3a1 1 0 102 0v-3zm3 0a1 1 0 10-2 0v3a1 1 0 102 0v-3zM8.707 4h2.586a1 1 0 01.707.293L13 5h4a1 1 0 110 2h-1v9a4 4 0 01-4 4H8a4 4 0 01-4-4V7H3a1 1 0 110-2h4l.293-.293A1 1 0 018.707 4z"
                                              clipRule="evenodd"
                                          ></path>
                                      </svg>
                                  )}

                                  {/* Card Title */}
                                  <CardTitle className="text-lg font-medium text-primary dark:text-white">{title}</CardTitle>
                              </div>
                          </CardHeader>

                          <CardContent>
                              <p className="text-secondary dark:text-gray-300 text-sm">{msg}</p>
                          </CardContent>

                          <CardFooter>
                              <div className="flex justify-end space-x-2">
                                  <button
                                      onClick={handleCancel}
                                      className="px-4 py-2 text-xs font-medium text-secondary dark:text-gray-200 bg-light/50 dark:bg-gray-900/50 rounded-md hover:bg-light/75 dark:hover:bg-gray-800 transition-colors"
                                  >
                                      Cancel
                                  </button>
                                  <button
                                      onClick={handleSave}
                                      className="px-4 py-2 text-xs font-medium text-white bg-highlight rounded-md hover:bg-highlight/90 transition-colors"
                                  >
                                      Save
                                  </button>
                              </div>
                          </CardFooter>
                      </Card>
                  </div>
              </div>
          </div>
      );
  };
  