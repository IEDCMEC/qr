import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Button, FormControl, FormLabel, Select, Flex, Switch, Box, Text } from '@chakra-ui/react';

import DashboardLayout from '@/layouts/DashboardLayout';
import Scanner from '@/components/Scanner';

import { useAlert } from '@/hooks/useAlert';
import { useFetch } from '@/hooks/useFetch';
import useWrapper from '@/hooks/useWrapper';

export default function CheckOutParticipantWithScanner() {
  const { loading, post, get } = useFetch();
  const showAlert = useAlert();

  const router = useRouter();
  const { orgId, eventId } = router.query;

  const { useGetQuery } = useWrapper();

  const [previousCheckInKey, setPreviousCheckInKey] = useState(null);
  const [checkInKey, setCheckInKey] = useState(null);
  const [participant, setParticipant] = useState(null);

  const [fastMode, setFastMode] = useState(false);

  const handleSubmit = async () => {
    const { data, status } = await post(
      `/core/organizations/${orgId}/events/${eventId}/participants/check-out`,
      {},
      {
        checkInKey,
        checkedInAt: new Date().toISOString(),
      },
    );
    if (status === 200) {
      showAlert({
        title: 'Success',
        description: data.message,
        status: 'success',
      });
      setPreviousCheckInKey(checkInKey);
      setCheckInKey(null);
      setParticipant(null);
    } else {
      showAlert({
        title: 'Error',
        description: data.error,
        status: 'error',
      });
      setCheckInKey(null);
      setPreviousCheckInKey(null);
    }
  };

  const { data, status, error } = useGetQuery(
    `/core/organizations/${orgId}/events/${eventId}/participants/check-in/${checkInKey}`,
    `/core/organizations/${orgId}/events/${eventId}/participants/check-in/${checkInKey}`,
    {},
    {},
    (data) => {
      setParticipant(data.data.participant);
    },
  );

  useEffect(() => {
    if (checkInKey && previousCheckInKey !== checkInKey && fastMode) {
      handleSubmit();
    }
  }, [checkInKey]);

  useEffect(() => {
    if (fastMode) {
      showAlert({
        title: 'Fast Mode',
        description: 'Fast mode is enabled. Participants will be checked out without confirmation.',
        status: 'info',
      });
    }
  }, [fastMode]);

  //
  // Periodically clear the previous participant id
  //
  useEffect(() => {
    const intervalId = setInterval(() => {
      setPreviousCheckInKey(null);
      setCheckInKey(null);
      setParticipant(null);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [previousCheckInKey]);

  return (
    <DashboardLayout
      pageTitle="Check Out Participant"
      previousPage={`/organizations/${orgId}/events/${eventId}/participants/check-in`}
      debugInfo={checkInKey + ' ' + previousCheckInKey}
    >
      <Flex height="100%" width="100%" flexDirection="column" alignItems="center">
        <Flex pb="6" justifyContent="center" alignItems="center" gap="6">
          <Text fontSize="xl">Fast Mode</Text>
          <Switch colorScheme="red" size="md" onChange={() => setFastMode(!fastMode)} />
        </Flex>
        <Box width={['100%', '60%', '50%', '30%']}>
          <Scanner result={checkInKey} setResult={setCheckInKey} />
        </Box>
        {!fastMode && participant && (
          <Flex width="100%" flexDirection="column" alignItems="center" gap="6">
            <Flex gap="1" width="100%" justifyContent="space-between">
              <Flex width="100%" flexDirection="column">
                <Text>First Name: {participant?.firstName}</Text>
                <Text>Last Name: {participant?.lastName}</Text>
                <Text>Email: {participant?.email}</Text>
                <Text>Phone: {participant?.phone}</Text>
              </Flex>
              <Flex width="100%" flexDirection="column">
                {participant.checkIn.status ? (
                  <>
                    <Text color="green" fontSize="xl">
                      Checked In
                    </Text>
                    <Text>Checked in at: {participant.checkIn.at}</Text>
                    <Text>Checked in by: {participant.checkIn.by.email}</Text>
                  </>
                ) : (
                  <Text color="red" fontSize="xl">
                    Not Checked In
                  </Text>
                )}
              </Flex>
            </Flex>
            <Flex gap="6">
              <Button onClick={handleSubmit}>Confirm</Button>
              <Button
                onClick={() => {
                  setCheckInKey(null);
                  setParticipant(null);
                  setPreviousCheckInKey(null);
                }}
              >
                Clear
              </Button>
            </Flex>
          </Flex>
        )}
      </Flex>
    </DashboardLayout>
  );
}
