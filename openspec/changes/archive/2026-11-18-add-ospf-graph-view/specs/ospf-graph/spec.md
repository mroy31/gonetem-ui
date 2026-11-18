# Spec Delta

## Purpose

Lets the user visualize a router's OSPF link-state database inside the project workspace as an interactive graph, with per-router selection, so OSPF adjacencies, networks, and costs are inspectable without leaving the GUI.

## ADDED Requirements

### Requirement: OSPF graph view entry
When the project is running, the system SHALL render the OSPF graph view for a selected router once the user switches to the OSPF view, defaulting to the first eligible router of the topology.

#### Scenario: Open OSPF view
- **WHEN** the user switches to the OSPF view of a running project whose topology has at least one eligible router
- **THEN** the view fetches that router's link-state databases and renders its OSPF graph

#### Scenario: Topology has no eligible router
- **WHEN** the user switches to the OSPF view and no topology node is an eligible router
- **THEN** the view shows an empty state with no graph and no error

### Requirement: Router selection tabs
The OSPF view SHALL present a bottom tab navigation listing, in topology order, every topology node whose type starts with `docker.router` or is `docker.vyos`, independently of whether the node currently carries OSPF data. Selecting a tab SHALL load that router's link-state databases and re-render the graph rooted at it.

#### Scenario: Tabs reflect the topology
- **WHEN** the OSPF view is shown for a topology containing nodes `r1` (type `docker.router`), `v1` (type `docker.vyos`) and `h1` (type `docker.host`)
- **THEN** the navigation shows tabs `r1` and `v1` in topology order and no tab for `h1`

#### Scenario: Switch router
- **WHEN** the user selects another router's tab
- **THEN** the system fetches that router's databases and renders the graph rooted at that router

### Requirement: Link-state database fetch
The system SHALL obtain a router's OSPF data by running the one-shot commands `vtysh -c "show ip ospf database router json"` and `vtysh -c "show ip ospf database network json"` on the selected node, on router selection and on explicit user refresh, and SHALL NOT poll automatically.

#### Scenario: Explicit refresh
- **WHEN** the user triggers refresh on the OSPF view
- **THEN** the system re-runs both database commands on the selected router and re-renders the graph from the fresh data

### Requirement: Vertex derivation
The system SHALL derive graph vertices from the router and network link-state data: one vertex per distinct originating router-id, one vertex per transit network labeled with the subnet prefix masked from the DR interface address and network LSA prefix length, or the bare DR address when its network LSA is missing, and one vertex per advertised stub network labeled with its masked network address. All areas SHALL merge into one graph with a single shared vertex per name.

#### Scenario: Transit subnet label
- **WHEN** a transit link's DR interface address and matching network LSA prefix length form a valid prefix
- **THEN** the transit vertex is labeled with the masked subnet prefix (for example `10.0.0.0/24`)

#### Scenario: One-sided transit
- **WHEN** a router LSA advertises a transit link but no network LSA exists for its DR address
- **THEN** the transit vertex is labeled with the bare DR interface address

#### Scenario: Multi-area router
- **WHEN** the same router-id originates router LSAs in more than one area
- **THEN** the graph shows a single vertex for that router-id carrying the links of all areas

### Requirement: Adjacency edge derivation and deduplication
Each usable transit link SHALL produce one edge between its owner router vertex and the transit vertex, and each point-to-point adjacency SHALL produce a single edge between the two router vertices. When both ends of a point-to-point adjacency originate router LSAs, the view of the smaller router-id SHALL be kept; when the neighbor originates no router LSA, the one-sided edge SHALL still be rendered.

#### Scenario: Point-to-point listed by both ends
- **WHEN** routers `2.2.2.2` and `1.1.1.1` each advertise the point-to-point adjacency to the other
- **THEN** the graph shows a single edge for that adjacency, built from the `1.1.1.1` LSA

#### Scenario: One-sided point-to-point
- **WHEN** a router LSA advertises a point-to-point neighbor that originates no router LSA
- **THEN** the adjacency is still rendered as an edge to that neighbor's vertex

### Requirement: Stub network edges
Each advertised stub network link SHALL produce one edge between the advertising router vertex and the stub network vertex, merged per (router, subnet) pair across links and areas. A subnet that is a transit network anywhere in the databases SHALL keep its transit typing when another router advertises it as a stub. Stub links with a /32 mask SHALL NOT be rendered.

#### Scenario: Duplicate stub advertisements merge
- **WHEN** two routers advertise the same stub subnet
- **THEN** the graph shows one shared subnet vertex with one edge per advertising router

#### Scenario: Loopback stub hidden
- **WHEN** a router advertises a stub network link with a 255.255.255.255 mask
- **THEN** the graph shows no vertex or edge for that link

### Requirement: Rooted layout
The graph layout SHALL root the rendered tree at the vertex for the queried router's own router-id.

#### Scenario: Root at queried router
- **WHEN** the graph for router `1.1.1.1` is rendered
- **THEN** the layout is arranged from the `1.1.1.1` vertex as its root

### Requirement: Edge labels
Each graph edge SHALL display the cost advertised by the originating side, and point-to-point edges SHALL additionally display the originating router's interface address.

#### Scenario: Cost and interface labels
- **WHEN** a point-to-point link with cost 10 from interface address `10.0.0.1` is rendered
- **THEN** the edge shows the cost `10` and the interface address `10.0.0.1`

### Requirement: Vertex styling and color legend
All graph vertices SHALL use a single rectangle shape with a white background whose border color distinguishes the vertex kind (router, transit network, stub network), the vertex label SHALL be drawn inside the rectangle, and the OSPF view SHALL display a legend mapping each color to its localized kind name while a graph is shown.

#### Scenario: Legend shown
- **WHEN** an OSPF graph is rendered
- **THEN** a legend shows the three vertex-kind colors with their localized names

#### Scenario: Kinds distinguishable
- **WHEN** a graph contains router, transit, and stub vertices
- **THEN** each vertex is drawn as a white rectangle whose border color matches its kind in the legend, with the label inside the rectangle

### Requirement: No usable OSPF data
When the queried node answers without any usable OSPF data (no router-id in the router database output), the system SHALL report that the node exposes no usable OSPF data and SHALL keep the router tab navigation usable.

#### Scenario: ospfd without an OSPF instance
- **WHEN** the selected router answers the database queries with empty objects
- **THEN** the view shows a no-OSPF-data message and the user can select another router's tab

### Requirement: Fetch failure reporting
When either database command fails on the selected node (non-zero exit status or communication error), the system SHALL display the resulting error and SHALL keep the router tab navigation usable.

#### Scenario: Node not reachable
- **WHEN** the database command on the selected router fails with a server or command error
- **THEN** the view shows an error message and the user can select another router's tab
