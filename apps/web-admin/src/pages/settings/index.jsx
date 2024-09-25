import { useRouter } from 'next/router';
import { useContext } from 'react';
import { account } from '@/contexts/MyContext';

import { Box, Flex, Text, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';

export default function Settings() {
  //const { loading, get, put } = useFetch();
  //const showAlert = useAlert();
  const { accountDetails, setAccountDetails, updateAccountDetails } = useContext(account);
  const [formData, setFormData] = useState({
    firstName: accountDetails.firstName || '',
    lastName: accountDetails.lastName || '',
  });
  useEffect(() => {
    console.log(formData, accountDetails);
  }, [formData, accountDetails]);
  return (
    <DashboardLayout pageTitle="Settings" previousPage={`/`} debugInfo={accountDetails}>
      <Box width="100%" height="100%">
        <Text fontSize="2xl" fontWeight="bold">
          Account Settings
        </Text>
        <Box width="100%" display="flex" flexDirection="column" justifyContent="start" gap={4}>
          <FormControl
            isRequired
            my={4}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <FormLabel>First Name</FormLabel>
            <Input
              type="text"
              name="firstName"
              value={formData.firstName || ''}
              onChange={(e) => {
                setFormData((preValue) => {
                  return {
                    ...preValue,
                    firstName: e.target.value,
                  };
                });
              }}
            />
          </FormControl>
          <FormControl
            isRequired
            my={4}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <FormLabel>Last Name</FormLabel>
            <Input
              type="text"
              name="lastName"
              value={formData.lastName || ''}
              onChange={(e) => {
                setFormData((preValue) => {
                  return {
                    ...preValue,
                    lastName: e.target.value,
                  };
                });
              }}
            />
          </FormControl>
        </Box>
        <Button
          onClick={() => {
            setAccountDetails((preValue) => {
              return {
                ...preValue,
                ...formData,
              };
            });
            updateAccountDetails();
          }}
        >
          Save
        </Button>
      </Box>
    </DashboardLayout>
  );
}
