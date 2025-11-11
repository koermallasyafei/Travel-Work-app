export const INITIAL_DOT_STRING = `digraph "NomadSphere_Feature_Flow" {
  // --- Graph Attributes ---
  bgcolor="transparent"
  rankdir="TB"
  splines="ortho"
  overlap="false"
  fontname="Arial"
  fontsize="12"
  label="NomadSphere: App Feature Flow"
  fontcolor="#e2e8f0"

  // --- Node & Edge Defaults ---
  node [shape="box", style="rounded,filled", fontname="Arial", fontsize="10", penwidth="0"]
  edge [fontname="Arial", fontsize="9", color="#64748b"]

  // --- Node Styles ---
  node [color="#1e293b", fontcolor="#cbd5e1"] // Default node

  // --- Nodes Definition ---
  Onboarding [label="🔑 Onboarding\\n- Login / Sign Up\\n- Choose Preferences", shape="ellipse", style="filled", color="#10b981"]
  Home [label="🏠 Home Dashboard\\n- City Overview\\n- Quick Menu", shape="house", color="#38bdf8"]
  
  subgraph "cluster_CoreFeatures" {
    label="Core Features"
    style="rounded,filled"
    color="#1e293b"
    fontcolor="#94a3b8"

    FindStay [label="🏡 Find Stay\\n- Search Coliving / Airbnb\\n- Filter: Wi-Fi, Workspace, Price", color="#f59e0b"]
    WorkSpots [label="💻 Work Spots\\n- Coworking / Café Map\\n- Productivity Rating", color="#f59e0b"]
    Community [label="🧑‍🤝‍🧑 Community Feed\\n- Events, Meetup, Nomads Nearby", color="#f59e0b"]
    Planner [label="📅 Smart Planner\\n- Schedule + Budget + Travel Plan", color="#f59e0b"]
  }

  subgraph "cluster_SupportingFeatures" {
    label="Supporting Features"
    style="rounded,filled"
    color="#1e293b"
    fontcolor="#94a3b8"
    rank="same"

    Notification [label="🔔 Notifications\\n- Tips, Events, City Updates", color="#84cc16"]
    Insights [label="📊 Insights & Reviews\\n- City Scores\\n- Personal Stats", color="#84cc16"]
  }

  // --- Flow Connections ---
  Onboarding -> Home

  Home -> FindStay
  Home -> WorkSpots
  Home -> Community
  Home -> Planner
  
  Home -> Notification [style="dashed"]
  Home -> Insights [style="dashed"]
  
  // Connections between features
  FindStay -> Planner [style="dotted", constraint=false]
  WorkSpots -> Planner [style="dotted", constraint=false]
  Community -> Planner [style="dotted", constraint=false]
}`;
