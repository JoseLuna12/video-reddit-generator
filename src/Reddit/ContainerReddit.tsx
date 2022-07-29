import React from "react";

export const ContainerReddit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  )
}