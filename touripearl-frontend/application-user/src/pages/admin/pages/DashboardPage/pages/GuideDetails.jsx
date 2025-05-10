import { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";

const GuideDetails = () => {
    const [guides, setGuides] = useState([]);

    useEffect(() => {
        // Fetch guide details from backend
        fetch("http://localhost:8080/api/guides")
            .then((response) => response.json())
            .then((data) => setGuides(data))
            .catch((error) => console.error("Error fetching guides:", error));
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guides.length > 0 ? (
                guides.map((guide) => (
                    <Card key={guide.id} sx={{ maxWidth: 400 }}>
                        <CardContent>
                            <Typography variant="h6">{guide.name}</Typography>
                            <Typography><strong>Experience:</strong> {guide.experience} years</Typography>
                            <Typography><strong>Languages:</strong> {guide.languages.join(", ")}</Typography>
                            <Typography><strong>Rating:</strong> {guide.rating} ⭐</Typography>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography className="text-gray-500">No guide details available.</Typography>
            )}
        </div>
    );
};

export default GuideDetails;
