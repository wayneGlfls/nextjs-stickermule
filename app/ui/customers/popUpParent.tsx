import Modal from './popupClient';
import PopupServer from './popupServer';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';

export default function PopUpParent({customerId}:{customerId:string}) {
    console.log(`customerId is ${customerId}`);
    return (
        <div>
            <Modal>
                <PopupServer customerId={customerId}/>
            </Modal>
        </div>)
}