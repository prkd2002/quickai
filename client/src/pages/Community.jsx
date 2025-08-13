import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Heart, LoaderCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();
  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        "/api/user/toggle-like-creation",
        { id },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchCreations();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const fetchCreations = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      console.log("Data", data);
      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  return !isLoading && creations.length > 0 ? (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      Kreationen
      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll ">
        {creations.length > 0 &&
          creations.map((item, index) => (
            <div
              key={index}
              className="relative cursor-pointer group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3"
            >
              <img
                src={item.content}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg">
                <p className="text-sm hidden group-hover:block">
                  {item.prompt}
                </p>
                <div className="flex gap-1 items-center">
                  <p>{item.likes.length}</p>
                  <Heart
                    onClick={() => imageLikeToggle(item.id)}
                    className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${
                      item.likes.includes(user.id)
                        ? "fill-red-500 text-red-600"
                        : "text-white"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-full">
      <LoaderCircle className="w-10 h-10 animate-spin" />
    </div>
  );
};

export default Community;
