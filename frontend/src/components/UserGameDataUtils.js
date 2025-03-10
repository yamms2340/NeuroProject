import axios from "axios";

export const fetchUserData = async (setUser, setIQScore, setDataset) => {
    try {
        console.log("Fetching user...");

        const response = await axios.get("http://localhost:8080/api/get-user", { withCredentials: true });

        console.log("Fetched user response:", response.data);

        if (response.data.user) {
            console.log("User found:", response.data.user, response.data.IQScore);
            setUser(response.data.user);
            setIQScore(response.data.user.IQScore);

            // ✅ Retrieve dataset properly
            let newDataset = response.data.user.dataset || [];
            console.log("Dataset before check:", newDataset.length);

            // ✅ If dataset size > 20, remove the oldest row
            if (newDataset.length > 20) {
                newDataset = newDataset.slice(1); // Remove first entry
                console.log("Dataset after removing oldest row:", newDataset);

                // ✅ Update state and send to backend
                setDataset(newDataset);

                await axios.post(
                    "http://localhost:8080/api/update-user-dataset-deletion",
                    { email: response.data.user.email, dataset: newDataset },
                    { withCredentials: true }
                );

                console.log("✅ Dataset updated successfully!(Deleted the oldest row)");
            } else {
                setDataset(newDataset);
            }
        } else {
            console.error("User data missing from response:", response.data);
        }
    } catch (error) {
        console.error("❌ Error fetching user:", error);
    }
};
