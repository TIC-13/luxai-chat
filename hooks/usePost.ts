import { useCallback, useState } from 'react';

/**
 * Possible states of the HTTP request
 */
type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Configuration options for the usePost hook
 * @template TData - The expected response data type
 * @template TParams - The request parameters type
 */
interface UsePostOptions<TData, TParams> {
  /**
   * Callback function called when the request succeeds
   * @param data - The response data from the API
   * @param params - The original parameters passed to execute()
   */
  onSuccess?: (data: TData, params: TParams) => void;
  
  /**
   * Callback function called when the request fails
   * @param error - The error object
   * @param params - The original parameters passed to execute()
   */
  onError?: (error: Error, params: TParams) => void;
  
  /**
   * Additional HTTP headers to include in the request
   */
  headers?: Record<string, string>;
  
  /**
   * Additional fetch options (method will be overridden to POST)
   */
  [key: string]: any;
}

/**
 * Return value of the usePost hook
 * @template TData - The expected response data type
 * @template TParams - The request parameters type
 */
interface UsePostReturn<TData, TParams> {
  /** Current status of the request */
  status: Status;
  
  /** Response data from the successful request, null if no data yet */
  data: TData | null;
  
  /** Error message if the request failed, null if no error */
  error: string | null;
  
  /** Function to execute the POST request with given parameters */
  execute: (params: TParams) => Promise<TData>;
  
  /** Function to reset the hook state back to idle */
  reset: () => void;
  
  /** True when the request is in progress */
  isLoading: boolean;
  
  /** True when the request completed successfully */
  isSuccess: boolean;
  
  /** True when the request failed */
  isError: boolean;
  
  /** True when no request has been made yet */
  isIdle: boolean;
}

/**
 * Custom React hook for making POST requests with status tracking and callbacks
 * 
 * @template TData - The expected response data type from the API
 * @template TParams - The type of parameters to send in the request body
 * 
 * @param url - The API endpoint URL to send the POST request to
 * @param options - Configuration options including callbacks and fetch options
 * 
 * @returns Object containing request state, data, error, and control functions
 * 
 * @example
 * ```typescript
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 * 
 * interface CreateUserParams {
 *   name: string;
 *   email: string;
 * }
 * 
 * const MyComponent = () => {
 *   const { execute, isLoading, data, error } = usePost<User, CreateUserParams>(
 *     'https://api.example.com/users',
 *     {
 *       onSuccess: (user, params) => {
 *         console.log('Created user:', user.name);
 *       },
 *       onError: (error, params) => {
 *         console.error('Failed to create user:', error.message);
 *       }
 *     }
 *   );
 * 
 *   const handleCreateUser = async () => {
 *     try {
 *       const user = await execute({ name: 'John', email: 'john@example.com' });
 *       // Handle success
 *     } catch (error) {
 *       // Handle error
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       <button onClick={handleCreateUser} disabled={isLoading}>
 *         {isLoading ? 'Creating...' : 'Create User'}
 *       </button>
 *       {error && <div>Error: {error}</div>}
 *       {data && <div>Created user: {data.name}</div>}
 *     </div>
 *   );
 * };
 * ```
 */
const usePost = <TData = any, TParams = any>(
  url: string,
  options: UsePostOptions<TData, TParams> = {}
): UsePostReturn<TData, TParams> => {
  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { onSuccess, onError, ...fetchOptions } = options;

  /**
   * Execute the POST request with the given parameters
   * 
   * @param params - The data to send in the request body
   * @returns Promise that resolves with the response data
   * @throws Error if the request fails
   */
  const execute = useCallback(async (params: TParams): Promise<TData> => {
    if (!url) {
      throw new Error('URL is required');
    }

    setStatus('loading');
    setError(null);
    setData(null);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
        body: JSON.stringify(params),
        ...fetchOptions,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: TData = await response.json();
      setData(result);
      setStatus('success');
      
      if (onSuccess) {
        onSuccess(result, params);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setStatus('error');
      
      if (onError) {
        const errorObj = err instanceof Error ? err : new Error(errorMessage);
        onError(errorObj, params);
      }

      throw err;
    }
  }, [url, onSuccess, onError, fetchOptions]);

  /**
   * Reset the hook state back to idle
   * Clears data, error, and sets status to 'idle'
   */
  const reset = useCallback(() => {
    setStatus('idle');
    setData(null);
    setError(null);
  }, []);

  return {
    status,
    data,
    error,
    execute,
    reset,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    isIdle: status === 'idle'
  };
};

export default usePost;
