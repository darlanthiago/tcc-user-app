import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "native-base";
import { api } from "../../../services/api";

type User = {
  id: string;
  name: string;
  email: string;
  birth_date: string;
};

type Address = {
  id: string;
  street_name: string;
  street_number: string;
  neighborhood: string;
  zipcode: string;
  city: string;
  state: string;
  lat?: number;
  long?: number;
};

type Truck = {
  id: string;
  name: string;
  email: string;
  address_id?: string;
  isFavorite: boolean;
};

type FavoriteTruck = {
  truck_id: string;
};

type AuthContextType = {
  login(email: string, password: string): Promise<void>;
  logout(): void;
  signedUser: User;
  isSigned: boolean;
  isLoading: boolean;
  trucks: Truck[];
  favoriteTrucks: Array<string>;
  addToFavorites(truck_id: string): Promise<void>;
  searchTruck(address: string): void;
  searchLoading: boolean;
  currentAddress: string;
};

const AuthContext = createContext({} as AuthContextType);

const Auth: React.FC = ({ children }) => {
  const toast = useToast();

  const [signedUser, setSignedUser] = useState({} as User);
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [favoriteTrucks, setFavoriteTrucks] = useState<Array<string>>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<string>("");

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const [token, user] = await AsyncStorage.multiGet([
        "@FindFood:token",
        "@FindFood:user",
      ]);

      if (token[1] && user[1]) {
        const userFromStorage = JSON.parse(user[1]);

        api.defaults.headers.common["Authorization"] = `Bearer ${JSON.parse(
          token[1]
        )}`;

        const response = await api.get(`/user/${userFromStorage.id}`);

        const queryString = `?filters=[${
          response.data.id
            ? JSON.stringify({
                field: "user_id",
                operation: "=",
                value: response.data.id,
              })
            : ""
        }]`;

        const responseFavorites = await api.get(
          `/favoriteTrucks${encodeURI(queryString)}`
        );

        if (responseFavorites.data) {
          let responseFavoritesMapped = responseFavorites.data.map(
            (item: FavoriteTruck) => item.truck_id
          );

          setFavoriteTrucks(responseFavoritesMapped);
        }

        await AsyncStorage.mergeItem(
          "@FindFood:user",
          JSON.stringify(response.data)
        );

        setSignedUser(response.data);

        setIsLoading(false);
        setIsSigned(true);
      } else {
        setSignedUser({} as User);
        setIsLoading(false);
        setIsSigned(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setSearchLoading(true);

      const splitedAddress = currentAddress.split(" - ");

      const queryString = `?filters=[${
        splitedAddress[0]
          ? JSON.stringify({
              field: "address.city",
              operation: "=",
              value: splitedAddress[0],
            })
          : ""
      }]`;

      await api
        .get(`/trucks${encodeURI(queryString)}`, {
          headers: {
            relationships: '["address"]',
          },
        })
        .then((resp) => {
          const filteredTrucks = resp.data.map((item: Truck) => ({
            ...item,
            isFavorite: favoriteTrucks.includes(item.id),
          }));

          setTrucks(filteredTrucks);

          setSearchLoading(false);
        })
        .catch((err) => {
          setSearchLoading(false);
        });
    })();
  }, [currentAddress, favoriteTrucks]);

  const login = useCallback(
    async (email, password) => {
      setIsLoading(true);

      await api
        .post("/loginByUser", { email, password })
        .then(async (resp) => {
          await AsyncStorage.multiSet([
            ["@FindFood:token", JSON.stringify(resp.data.token)],
            ["@FindFood:user", JSON.stringify(resp.data.user)],
          ]);

          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${resp.data.token}`;

          const { id, name, email, birth_date } = resp.data.user;

          setSignedUser({ id, name, email, birth_date });

          setIsLoading(false);

          setIsSigned(true);

          toast.show({
            placement: "top",
            title: "Sucesso",
            status: "success",
            description: "Login efetuado",
          });
        })
        .catch(async (err) => {
          setIsSigned(false);

          await AsyncStorage.multiRemove(["@FindFood:token", "@FindFood:user"]);

          setIsLoading(false);

          toast.show({
            placement: "top",
            title: "Ops!",
            status: "error",
            description: "Verifique os dados e tente novamente",
          });
        });
    },
    [toast]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);

    await AsyncStorage.multiRemove(["@FindFood:token", "@FindFood:user"]);

    delete api.defaults.headers.common["Authorization"];

    setIsSigned(false);
    setIsLoading(false);
  }, []);

  const searchTruck = useCallback((address: string) => {
    setCurrentAddress(address);
  }, []);

  const addToFavorites = useCallback(
    async (truckId: string) => {
      if (!favoriteTrucks.includes(truckId)) {
        await api
          .post(`/favoriteTruck`, {
            user_id: signedUser.id,
            truck_id: truckId,
          })
          .then((resp) => {
            setFavoriteTrucks([...favoriteTrucks, resp.data.truck_id]);
          });
      }
    },
    [favoriteTrucks]
  );

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isSigned,
        isLoading,
        signedUser,
        trucks,
        favoriteTrucks,
        addToFavorites,
        searchTruck,
        searchLoading,
        currentAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useRNAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }

  return context;
}

export { useRNAuth, Auth, AuthContext };
