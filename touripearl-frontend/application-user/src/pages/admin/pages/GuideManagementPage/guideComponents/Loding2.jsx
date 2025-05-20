import React from 'react'

function Loding2() {
  return (
    <div>
                          <div className="flex justify-center items-center py-10">
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center">
                                            {/* Spinner */}
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
    </div>
  )
}

export default Loding2
