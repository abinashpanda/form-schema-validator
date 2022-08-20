import axios from 'axios'
import { QueryClient } from 'react-query'

export const apiClient = axios.create({
  baseURL: 'https://eservices.uk.gov.in/api/',
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})
