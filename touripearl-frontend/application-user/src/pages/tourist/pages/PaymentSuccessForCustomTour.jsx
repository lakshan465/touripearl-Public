import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axiosFetch from '../../../utils/axiosFetch';

const PaymentSuccessForCustomTour = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const paymentId = searchParams.get('paymentId');
    const payerId = searchParams.get('PayerID');
    const tourId = searchParams.get('reservationId');

    if (paymentId && payerId && tourId) {
      axiosFetch.post('api/payments/executeForCustomTour', {
        paymentId,
        payerId,
        tourId,
      })
      .then((response) => {
        toast.success('Payment Successful!');
        navigate('/');
      })
      .catch((error) => {
        console.error('Payment Verification Error:', error);
        toast.error('Payment Verification Failed!');
        navigate('/payment/fail');
      });
    }
  }, [searchParams, navigate]);

  return (
    <div className="h-screen flex items-center justify-center text-xl font-semibold">
      Processing Payment, Please Wait...
    </div>
  );
};

export default PaymentSuccessForCustomTour;
