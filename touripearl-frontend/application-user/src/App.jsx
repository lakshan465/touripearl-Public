import './App.css'
import {Route, Routes} from "react-router-dom";
import React, {Suspense} from 'react';
import Loader from "@components/loader/Loader.jsx";
import ApplicationRoutes from '@admin/GuideManagementPage/guideComponents/guideRoutes.jsx';  
import { Toaster } from 'react-hot-toast';
import CustomTour from './components/createCuztomTour/MultiStepForm.jsx'
import CustomTourView from './components/createCuztomTour/ViewCreateProposal.jsx'
import ConfirmCustomTourView from './components/createCuztomTour/ConfirmTourList.jsx'
import CustomOneTourViewForTourist from './components/createCuztomTour/ViewOneTour.jsx'
import ViewCustomTourList from './pages/guide/ViewCustomTourList/CustomTourList.jsx'
import ViewOneCusTour from './pages/guide/ViewCustomTourList/ViewOneTour.jsx'
import TourDetails from "./components/tour/TourDetails.jsx";
import {UserNotFound} from "./components/not-found/NotFound.jsx";
import ImgView from "./pages/admin/pages/DashboardPage/DashBordCompo/imgView.jsx";
import OneTourBasicBill from '././pages/guide/ViewCustomTourList/ViewBasicBill.jsx';

import GuideSelectedTour from "./pages/guide/ViewCustomTourList/selectedTour/GuideSelectTourList.jsx"
import ConfirmTourList  from "./pages/guide/ViewCustomTourList/confirmTour/ConfirmTourList.jsx"
import OneConfirmTour  from "./pages/guide/ViewCustomTourList/confirmTour/OneConfirmTour.jsx"
import SelectedOneTour from "./pages/guide/ViewCustomTourList/selectedTour/OneTour.jsx"
import GuideListForOneTour from './components/createCuztomTour/ViewGuideList.jsx'
import GuideFullDetail from './components/createCuztomTour/GuideFullDetail.jsx'
import ViewBill from './components/createCuztomTour/ViewBill.jsx'
import ConfirmBtn from './components/createCuztomTour/ConfirmTourBtn.jsx'
import PaymentGateWay from './components/createCuztomTour/PaymentGateway.jsx'
// Lazy load the components
const ReviewPopup = React.lazy(() => import('@components/review-popup/ReviewPopup.jsx'))
const AddDestinationForm = React.lazy(() => import('./components/add-destination-form/AddDestinationForm.jsx'));
const RoleBasedRedirect = React.lazy(() => import('./pages/RoleBasedRedirect.jsx'));
const DashboardPage = React.lazy(() => import('@admin/dashboardPage/DashboardPage.jsx'));
const GuideManagementPage = React.lazy(() => import('@admin/guideManagementPage/GuideManagementPage.jsx'));
const UserTable = React.lazy(() => import('@admin/UserManagement/UserTable.jsx'));
const UserView = React.lazy(() => import('@admin/userManagement/UserView.jsx'));
const GuideApplicationForm = React.lazy(() => import('@components/guide-application-form/GuideApplicationForm.jsx'));
const UserEdit = React.lazy(() => import('@admin/userManagement/UserEdit.jsx'));
const ProfileEdit = React.lazy(() => import('@guide/GuideProfile/ProfileEdit.jsx'));
const ApplicationStatus = React.lazy(() => import('@components/applicationStatus/ApplicationStatus.jsx'));
const ForgotPasswordForm = React.lazy(() => import('@components/forgot-password-form/ForgotPasswordForm.jsx'));
const TokenInput = React.lazy(() => import('@components/forgot-password-form/token-verify/token-input.jsx'));
const HomePage = React.lazy(() => import('./components/home/Home.jsx'));
const AboutUs = React.lazy(() => import('./components/about-us/AboutUs.jsx'));
const ContactUs = React.lazy(() => import('./components/contact-us/ContactUs.jsx'));
const UserProfile = React.lazy(() => import('./components/user-profile/UserProfile.jsx'));
const Login = React.lazy(()=> import ('./components/login/Login.jsx'));
const GuestLayout = React.lazy(() => import("./components/user-layouts/GuestLayout.jsx"));
const GuideLayout = React.lazy(() => import("./components/user-layouts/GuideLayout.jsx"));
const AdminRedirect =React.lazy(()=>import("./pages/admin/Redirect/AdminRedirect.jsx"));
const GuideDashboard = React.lazy(()=>import("./pages/guide/Dashboard/GuideDashboard.jsx"));
const SignUp = React.lazy(()=>import("./components/signup/SignUp.jsx"));
const EventView = React.lazy(()=>import("@admin/EventManagementPage/EventView.jsx"))
const EmailVerify = React.lazy(()=>import("@components/email-verify/EmailVerify.jsx"));
const GuideProfile =React.lazy(()=>import("@components/guide-profile/GuideProfile.jsx"));
const EventCreate = React.lazy(()=>import("@admin/EventManagementPage/EventCreate.jsx"));
const EventTable = React.lazy(()=>import("@admin/EventManagementPage/EventTable.jsx"));
const ViewAllEvents = React.lazy(()=>import("@guest/events/ViewAllEvents.jsx"));
const ViewEvent = React.lazy(()=>import("@guest/events/ViewSingleEvent.jsx"));
const Destinations = React.lazy(()=>import("@components/destination-cards/DestinationCards.jsx"));
const EventUpdate = React.lazy(()=>import("@admin/EventManagementPage/EventUpdate.jsx"));
const DestinationDetails = React.lazy(() => import("./components/destination-details/DestinationDetails.jsx"));
const DestinationManagementPage = React.lazy(() => import('./pages/admin/pages/DestinationManagementPage/destinationManagement.jsx'));
const DestinationReview = React.lazy(() => import('./pages/admin/pages/DestinationManagementPage/DestinationComponents/DestinationReview.jsx'));
const DestinationUpdate = React.lazy(() => import('./pages/admin/pages/DestinationManagementPage/DestinationComponents/DestinationUpdate.jsx'));
const TourDBCreate = React.lazy(() => import('@guide/TourManagement/TourDBCreate.jsx'));
const TourDBList = React.lazy(() => import('@guide/TourManagement/TourDBList.jsx'));
const TourDBView = React.lazy(() => import('@guide/TourManagement/TourDBView.jsx'));
const TourDBEdit = React.lazy(() => import('@guide/TourManagement/TourDBEdit.jsx'));
const ReservationForm = React.lazy(() => import('@tourist/ReservationForm.jsx'));
const ReservationList = React.lazy(() => import('@guide/ReservationManagement/ReservationList.jsx'));
const Reservation = React.lazy(() => import('@guide/ReservationManagement/Reservation.jsx'));
const TouristReservationList = React.lazy(() => import('@tourist/TouristReservationList.jsx'));
const ReservationCancel = React.lazy(() => import('@tourist/ReservationCancel.jsx'));
const TouristReservation = React.lazy(() => import('@tourist/TouristReservation.jsx'));
const PaymentSuccess = React.lazy(() => import('@tourist/PaymentSuccess.jsx'));
const PaymentSuccessForCustomTour = React.lazy(() => import('@tourist/PaymentSuccessForCustomTour.jsx'));

const GuideListingPage = React.lazy(() => import('@components/guide-listing/guide-listing-page.jsx'));
const GuideIntro = React.lazy(()=> import('@components/guideIntroduction/guideIntro.jsx'))
const DisputeForm = React.lazy(() => import('@components/dispute/DisputeForm.jsx'));
const TouristBookingList = React.lazy(() => import('@components/tourist-booking-list/TouristBookingList.jsx'));
const BookingDetailPage = React.lazy(() => import('@components/tourist-booking-list/BookingDetailPage.jsx'));
const GuideDashboardPage = React.lazy(() => import('@guide/DashboardPage/GuideDashboardPage.jsx'));
const DisputeResolution = React.lazy(()=> import('@admin/DisputeManagementPage/DisputeResolution.jsx'));
const DisputeTable = React.lazy(()=> import('@admin/DisputeManagementPage/DisputeTable.jsx'));
const BookingTable = React.lazy(()=>import('@admin/BookingManagementPage/BookingTable.jsx'));
const BookingDetails = React.lazy(()=>import('@admin/BookingManagementPage/BookingDetails.jsx'));
const BookingTableGuide = React.lazy(()=>import('@guide/BookingManagement/BookingTableGuide.jsx'));
const BookingDetailsGuide = React.lazy(()=>import('@guide/BookingManagement/BookingDetailsGuide.jsx'));
const BookingCancel = React.lazy(()=>import('@components/tourist-booking-list/BookingCancel.jsx'))
const RefundTable = React.lazy(()=>import('@admin/RefundManagementPage/RefundTable.jsx'));
const RefundDetails = React.lazy(()=>import('@admin/RefundManagementPage/RefundDetails.jsx'));

function App() {

    return (
        <>
            <div><Toaster/></div>
            <div>
                <Suspense fallback={<div><Loader/></div>}>

                    <Routes>
                        {/* admin routes */}
                        <Route path='/admin' element={<AdminRedirect/>}/>
                        <Route path='/admin/dashboard' element={<DashboardPage/>}/>
                        <Route path='/admin/guide-management' element={<GuideManagementPage/>}/>
                        <Route path='/admin/user-management' element={<UserTable/>}/>
                        <Route path='/admin/user-management/:userId' element={<UserView/>}/>
                        <Route path='/admin/user-management/:userId/edit' element={<UserEdit/>}/>
                        <Route path='/admin/event-management/create' element={<EventCreate/>}/>
                        <Route path='/admin/event-management' element={<EventTable/>}/>
                        <Route path='/admin/event-management/update/:eventId' element={<EventUpdate/>}/>
                        <Route path='/admin/event-management/:eventId' element={<EventView/>}/>
                        <Route path='/admin/sldeShow' element={<ImgView/>}/>
                        {ApplicationRoutes()}

                        <Route path='/admin/event-management/create' element={<EventCreate/>}/>
                        <Route path='/admin/event-management' element={<EventTable/>}/>
                        <Route path='/admin/event-management/update/:eventId' element={<EventUpdate/>}/>
                        <Route path='/admin/destination-management' element={<DestinationManagementPage/>}/>
                        <Route path='/admin/destination-management/:destinationId' element={<DestinationReview/>}/>
                        <Route path='/admin/destination-management/:destinationId/edit' element={<DestinationUpdate/>}/>
                        <Route path='/admin/dispute-management' element={<DisputeTable/>}/>
                        <Route path='/admin/dispute-management/:disputeId' element={<DisputeResolution/>}/>
                        <Route path='/admin/booking-management' element={<BookingTable/>}/>
                        <Route path='/admin/booking-management/:bookingId' element={<BookingDetails/>}/>
                        <Route path='admin/refund-management' element={<RefundTable/>}/>
                        <Route path='admin/refund-management/:refundId' element={<RefundDetails/>}/>
                        {/*landing route*/}
                        <Route path='/' element={<RoleBasedRedirect/>}/>


                        {/* guide routes */}
                        <Route path='/guide' element={<GuideLayout><GuideDashboard/></GuideLayout>}/>
                        {/*
                        <Route path='/guide/profile' element={<GuideLayout><ProfileView/></GuideLayout>}/>*/}


                        <Route path='/guide/dashboard' element={<GuideDashboardPage/>}/>
                        <Route path="/guide/booking-management/bill" element={<OneTourBasicBill/>}/>
                        <Route path='/guide/profile' element={<ProfileEdit/>}/>
                        <Route path="/guide/tour-management/create" element={<TourDBCreate/>}/>
                        <Route path="/guide/tour-management/edit/:id" element={<TourDBEdit />}/>
                        <Route path='/guide/booking-management' element={<ViewCustomTourList/>}/>
                        <Route path='/guide/booking-management/oneTour' element={<ViewOneCusTour/>}/>
                        <Route path='/guide/booking-management/selectedTour' element={<GuideSelectedTour/>}/>
                        <Route path='/guide/booking-management/selectedOneTour' element={<SelectedOneTour/>}/>
                        <Route path='/guide/booking-management/confirmTour' element={<ConfirmTourList/>}/>

                        <Route path='/guide/booking-management/oneConfirmTour' element={<OneConfirmTour/>}/>


                        <Route path='/guide/booking/booking-management' element={<BookingTableGuide/>}/>
                        <Route path='/guide/booking/booking-management/:bookingId' element={<BookingDetailsGuide/>}/>



                        <Route path='/guide/review/:id' element={<ReviewPopup/>}/>
                        <Route path='/guide/tour-management' element={<TourDBList/>}/>
                        <Route path='/guide/tour-management/:id' element={<TourDBView/>}/>
                        <Route path='/guide/reservations-management' element={<ReservationList/>}/>
                        <Route path='/guide/reservations-management/:id' element={<Reservation/>}/>

                        {/*tourist routs*/}
                        <Route path="/tourist/profile" element={<UserProfile />} />
                        <Route path='/book/predefined/:id' element={<ReservationForm/>}/>
                        <Route path='/tourist/reservations' element={<TouristReservationList/>}/>
                        <Route path='/tourist/reservations/cancel/:id' element={<ReservationCancel/>}/>
                        <Route path='/tourist/reservations/:id' element={<TouristReservation/>}/>
                        <Route path='/payment/success' element={<PaymentSuccess/>}/>

                        <Route path='/payment/successForCustomer' element={<PaymentSuccessForCustomTour/>}/>

                        <Route path='/dispute/:bookingId' element={<DisputeForm/>}/>
                        <Route path='/tourist/booking-list' element={<TouristBookingList/>}/>
                        <Route path='/tourist/booking-list/:bookingId' element={<BookingDetailPage/>}/>
                        <Route path='/tourist/booking-list/:bookingId/cancel' element={<BookingCancel/>}/>
                        {/* guest routes */}
                        <Route path='/application/status/:applicationId' element={<ApplicationStatus/>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='/forgot-password' element={<ForgotPasswordForm/>}/>
                        <Route path='/forgot-password/verify' element={<TokenInput/>}/>
                        <Route path='/signUp' element={<SignUp />} />
                        <Route path="/home" element={<GuestLayout><HomePage /></GuestLayout>} />
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route path="/contact-us" element={<ContactUs />} />
                        <Route path="/guide-application-form" element={<GuideApplicationForm />} />
                        <Route path="/add-destination-form" element={<AddDestinationForm />} />
                        <Route path="/destinations" element={<Destinations/>}/>
                        <Route path="/destinations/:destinationId" element={<DestinationDetails />} />
                        <Route path="/email-verification" element={<EmailVerify />} />
                        <Route path="/upcoming-events" element={<ViewAllEvents />} />
                        <Route path="/events/:eventId" element={<ViewEvent />} />
                        <Route path="*" element={<UserNotFound />} />
                        {/*<Route path="/tours" element={<ViewTours />}/>*/}
                        <Route path="/tours/:id" element={<GuestLayout><TourDetails view="guest" /></GuestLayout>}/>
                        <Route path="/guides/:id" element={<GuestLayout><GuideProfile/></GuestLayout>}/>
                        <Route path="/guide-list" element={<GuestLayout><GuideListingPage/></GuestLayout>}/>
                        <Route path="/guide-intro" element={<GuestLayout><GuideIntro/></GuestLayout>} />
                        {/* tourist routes */}
                        <Route path="/customTour" element={<CustomTour/>}/>
                        <Route path="/customTourView" element={<CustomTourView/>}/>
                        <Route path="/customTourView/oneTour" element={<CustomOneTourViewForTourist/>}/>
                        <Route path="/customTourView/GuideList" element={<GuideListForOneTour/>}/>
                        <Route path="/customTourView/GuideFullDetail" element={<GuideFullDetail/>}/>
                        <Route path="/customTourView/ViewBill" element={<ViewBill/>}/>
                        <Route path="/customTourView/ConfirmBtn" element={<ConfirmBtn/>}/>
                        <Route path="/customTourView/PaymentGateWay" element={<PaymentGateWay/>}/>
                        <Route path="/confirmCustomTour" element={<ConfirmCustomTourView/>}/>
                        

                        
                    </Routes>
                </Suspense>
            </div>
            
        </>
    );
}

export default App;
