import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from 'react';
import { FunctionColumnProps } from '@/pages/CsvEditor';



export type AppContextType = {
  files: File[],
  setFiles: Dispatch<SetStateAction<File[]>>,
}

export const AppContext = createContext<AppContextType>({
  files: [],
  setFiles: () => {},
});

export const AppContextProvider: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
  const [files, setFiles] = useState<File[]>([]);

  return <AppContext.Provider
    value={{
      files,
      setFiles,
    }}
  >
    {children}
  </AppContext.Provider>
}

export const useAppContext: () => AppContextType = () => {
  return useContext(AppContext);
}