import { useState, useEffect } from 'react';
import { Button, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/layouts/DashboardLayout';
import DataDisplay from '@/components/DataDisplay';
import { useAlert } from '@/hooks/useAlert';
import { useFetch } from '@/hooks/useFetch';
import { CSVLink } from 'react-csv';
import AddParticipant from '@/components/AddParticipant';
import MultiStepModal from '@/components/MultiFormEmail';
import { useContext } from 'react';
import { account } from '@/contexts/MyContext';
import useWrapper from '@/hooks/useWrapper';

const columns = [
  { field: 'firstName', headerName: 'First Name', width: 200 },
  { field: 'lastName', headerName: 'Last Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'phone', headerName: 'Phone', width: 200 },
  { field: 'checkInKey', headerName: 'Check In Key', width: 200 },
  { field: 'checkedIn', headerName: 'CheckedIn', width: 200 },
  { field: 'numberOfAttributesAssigned', headerName: 'Attributes Assigned', width: 200 },
  { field: 'numnerOfExtrasAssigned', headerName: 'Extras Assigned', width: 200 },
  { field: 'addedAt', headerName: 'Added At', width: 200 },
];

export default function Participants() {
  const { participants, setParticipants } = useContext(account);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkInKey: '',
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const showAlert = useAlert();
  const { orgId, eventId } = router.query;
  const { loading, get, post } = useFetch();
  const { useGetQuery } = useWrapper();

  // const { accountDetails } = useContext(account);

  const { data, status, error } = useGetQuery(
    `/core/organizations/${orgId}/events/${eventId}/participants`,
    `/core/organizations/${orgId}/events/${eventId}/participants`,
    {},
    {},
    (data) => {
      setParticipants(data.data.participants || []);
    },
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const [emailContent, setEmailContent] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(formData);
    const response = await post(
      `/core/organizations/${orgId}/events/${eventId}/participants`,
      {},
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        attributes: [],
        phone: formData.phone,
        email: formData.email,
        checkInKey: formData.checkInKey,
      },
    );
    //console.log(response)
    //console.log(response !== null || response !== undefined)
    if (response !== null || response !== undefined) {
      const { data, status } = response;
      //console.log('Hello world')
      //console.log(data);
      //console.log(participants)
      if (status === 200) {
        //console.log('super!')
        const value = {
          addedAt: data.newParticipant.createdAt,
          id: data.newParticipant.id,
          checkInKey: data.newParticipant.checkInKey,
          email: data.newParticipant.email,
          firstName: data.newParticipant.firstName,
          lastName: data.newParticipant.lastName,
          numberOfAttributesAssigned: 0,
          numnerOfExtrasAssigned: 0,
          phone: data.newParticipant.phone,
        };
        setParticipants((prevValue) => [...prevValue, value]);
        // showAlert({
        //   title: 'Success',
        //   description: 'participant has been added successfully.',
        //   status: 'success',
        // });
      } else {
        //console.log('fuck u')
        // showAlert({
        //   title: 'Failure',
        //   description: 'participant has not been added successfully.',
        //   status: 'Failure',
        // });
      }
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        checkInKey: '',
      });
      //console.log(participants);
    } else {
      //console.log(response)
      //console.log('Hihihi')
    }
    onClose();
  };
  const { isOpen: qrIsOpen, onOpen: qROnOpen, onClose: qROnClose } = useDisclosure();

  const exportToCsv = () => {
    const csvData = participants.map((participant) => ({
      firstName: participant.firstName,
      lastName: participant.lastName,
      email: participant.email,
      phone: participant.phone,
      checkInKey: participant.checkInKey,
      checkedIn: participant.checkedIn,
      numberOfAttributesAssigned: participant.numberOfAttributesAssigned,
      numberOfExtrasAssigned: participant.numberOfExtrasAssigned,
      addedAt: participant.addedAt,
    }));

    return (
      <CSVLink
        data={csvData}
        filename={`participants-${eventId}.csv`}
        style={{ textDecoration: 'none' }}
      >
        <Button colorScheme="teal" variant="solid">
          Export to CSV
        </Button>
      </CSVLink>
    );
  };

  return (
    <DashboardLayout
      pageTitle="Participants"
      previousPage={`/organizations/${orgId}/events/${eventId}`}
      headerButton={
        <>
          <Button onClick={onOpen} isLoading={loading}>
            Add Participant
          </Button>
          <Button
            onClick={() => router.push(`/${orgId}/events/${eventId}/participants/new/upload-csv`)}
            isLoading={loading}
          >
            Upload CSV
          </Button>
          {exportToCsv()}
          <Button onClick={qROnOpen}>Send Emails with QR</Button>
        </>
      }
      debugInfo={participants}
    >
      <DataDisplay loading={loading} rows={participants} columns={columns} />
      <MultiStepModal
        isOpen={qrIsOpen}
        onClose={qROnClose}
        emailContent={emailContent}
        setEmailContent={setEmailContent}
      />
      <AddParticipant
        isOpen={isOpen}
        onClose={onClose}
        formData={formData}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
      />
    </DashboardLayout>
  );
}
