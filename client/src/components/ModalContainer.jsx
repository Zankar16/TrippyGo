import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../store/uiSlice';
import { X } from 'lucide-react';
import CustomiseTripModal from './modals/CustomiseTripModal';
import AddActivityModal from './modals/AddActivityModal';
import AddExpenseModal from './modals/AddExpenseModal';
// import InviteTripmatesModal from './modals/InviteTripmatesModal';
// ... etc

const ModalContainer = () => {
  const { modals } = useSelector(state => state.ui);
  const dispatch = useDispatch();

  const activeModal = Object.entries(modals).find(([_, isOpen]) => !!isOpen);
  if (!activeModal) return null;

  const [modalName, modalData] = activeModal;

  const handleClose = () => {
    dispatch(closeModal(modalName));
  };

  const renderModalContent = () => {
    switch (modalName) {
      case 'customiseTrip':
        return <CustomiseTripModal data={modalData} onClose={handleClose} />;
      case 'addActivity':
        return <AddActivityModal data={modalData} onClose={handleClose} />;
      case 'addExpense':
        return <AddExpenseModal data={modalData} onClose={handleClose} />;
      // case 'inviteTripmates':
      //   return <InviteTripmatesModal data={modalData} onClose={handleClose} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />
      
      {/* MODAL WRAPPER */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl shadow-slate-900/20 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        <button 
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
        >
          <X size={20} />
        </button>
        {renderModalContent()}
      </div>
    </div>
  );
};

export default ModalContainer;
