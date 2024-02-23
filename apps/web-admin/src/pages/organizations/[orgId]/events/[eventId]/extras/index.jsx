import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Button } from '@chakra-ui/react';

import DashboardLayout from '@/layouts/DashboardLayout';

import { useFetch } from '@/hooks/useFetch';
import { useAlert } from '@/hooks/useAlert';

import DataDisplay from '@/components/DataDisplay';

const columns = [
  { field: 'name', headerName: 'Name', width: 200 },
  {
    field: 'numberOfParticipantsWithExtrasAssigned',
    headerName: 'No of Participants Assigned',
    width: 200,
  },
  {
    field: 'numberOfParticipantsWithExtrasCheckedIn',
    headerName: 'No of Participants Checked In',
    width: 200,
  },
];

export default function Extras() {
  const router = useRouter();
  const { orgId, eventId } = router.query;
  const showAlert = useAlert();

  const { loading, get } = useFetch();

  const [extras, setExtras] = useState([]);

  useEffect(() => {
    const fetchExtras = async () => {
      const { data, status } = await get(`/core/organizations/${orgId}/events/${eventId}/extras`);
      if (status === 200) {
        setExtras(data.extras || []);
      } else {
        showAlert({
          title: 'Error',
          description: data.error,
          status: 'error',
        });
      }
    };
    fetchExtras();
  }, []);

  return (
    <DashboardLayout
      pageTitle="Extras"
      previousPage={`/organizations/${orgId}/events/${eventId}`}
      headerButton={
        <>
          <Button
            onClick={() => {
              router.push(`/organizations/${orgId}/events/${eventId}/extras/new`);
            }}
            isLoading={loading}
          >
            Add Extra
          </Button>
        </>
      }
      debugInfo={extras}
    >
      <DataDisplay
        loading={loading}
        columns={columns}
        rows={extras}
        onRowClick={(row) => {
          router.push(`/organizations/${orgId}/events/${eventId}/extras/${row.id}`);
        }}
      />
    </DashboardLayout>
  );
}
