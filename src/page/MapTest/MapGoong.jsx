import React, { useEffect } from "react";

const MapGoong = () => {
  useEffect(() => {
    // Add Goong Maps CSS via CDN
    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Load Goong Maps JS
    import("@goongmaps/goong-js").then((goong) => {
      const goongjs = goong.default || goong; // Ensure correct module import
      const accessToken = "TPvdJs2CcCvPHoaoYq3ElDzvqKPiftmYBCqfhA66";
      
      goongjs.accessToken = accessToken; 

      const map = new goongjs.Map({
        container: "map",
        style: `https://tiles.goong.io/assets/goong_map_web.json?api_key=${accessToken}`,
        center: [105.83991, 21.02800], 
        zoom: 12,
      });

      map.addControl(new goongjs.NavigationControl(), "top-right");

      new goongjs.Marker()
        .setLngLat([105.83991, 21.02800])
        .setPopup(new goongjs.Popup().setText("Hello! This is Hanoi."))
        .addTo(map);

      return () => {
        document.head.removeChild(link);
        map.remove();
      };
    }).catch((error) => {
      console.error("Goong Maps failed to load:", error);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Goong Map Integration</h1>
      <div id="map" className="w-full max-w-4xl h-96 border rounded-lg shadow-lg"></div>
    </div>
  );
};

export default MapGoong;
