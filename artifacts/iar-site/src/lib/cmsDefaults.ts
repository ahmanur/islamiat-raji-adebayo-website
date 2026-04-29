export const CONTENT_DEFAULTS: Record<string, Record<string, string>> = {
  hero: {
    badge: 'Cornell Lab of Ornithology · Rose Postdoctoral Fellow',
    headline: 'Listening to the',
    headline_accent: 'urban forest.',
    tagline: 'Advancing conservation through bioacoustics and urban ecology. Studying how urbanization shapes bird communities and the relationship between people and nature.',
    btn_primary: 'Explore Research',
    btn_secondary: 'Get in Touch',
    institution: 'K. Lisa Yang Center for Conservation Bioacoustics, Cornell Lab of Ornithology',
  },
  about: {
    tagline: 'My research spans landscape and urban ecology, with broad interests in plant–animal interactions and the ecological and social impacts of urbanization and land-use change on bird communities in relation to human well-being.',
    para1: 'My trajectory from Nigeria to South Africa, to Canada, and now to Cornell has been shaped by a deep curiosity about how species adapt—or fail to adapt—to rapid environmental change. I use an interdisciplinary approach that integrates bioacoustics and community engagement to monitor biodiversity in rapidly changing urban landscapes.',
    para2: 'As a Rose Postdoctoral Fellow at the K. Lisa Yang Center for Conservation Bioacoustics at the Cornell Lab of Ornithology, my current research investigates bird diversity on university campuses and in cities across multiple countries using autonomous acoustic recorders. I collaborate with local experts and students to record bird songs, identifying which species persist, which do not, and why—helping us understand the factors that shape urban bird populations and guiding conservation planning.',
    para3: 'One of the most rewarding aspects of my work is the connection between nature and human well-being. I aim to develop conservation frameworks that support both ecological resilience and social well-being in urban settings. Before joining Cornell, I was a Postdoctoral Research Fellow in the Department of Biology at Queen\'s University in Canada, where I led a global urban bird survey project spanning five countries — Brazil, Canada, France, Kenya, and Senegal — using passive acoustic recorders and an innovative Community Science approach that actively involved local experts and the public in data collection. My doctoral research at the University of KwaZulu-Natal in South Africa focused on frugivory and seed dispersal by birds, bats, and monkeys in urban mosaic landscapes, with particular attention to the ecological role of Ficus species.',
    para4: 'I enjoy working with students and community and local scientists to co-design participatory monitoring methods that are scalable, community-driven, and relevant to both science and society. I am passionate about mentorship, outreach, and interdisciplinary collaboration.',
  },
  research: {
    intro: 'My research program asks fundamental questions about ecological resilience in the Anthropocene. I focus on understanding how we can build cities that act as refuges rather than barriers to biodiversity.',
    theme1_title: 'Bioacoustics',
    theme1_desc: 'Using sound as a non-invasive lens to monitor biodiversity, revealing hidden ecological patterns in urban environments.',
    theme2_title: 'Urban Ecology',
    theme2_desc: 'Investigating how rapid urbanization shapes bird communities and alters fundamental plant-animal interactions.',
    theme3_title: 'Human-Nature Dynamics',
    theme3_desc: 'Exploring the relationship between people and nature, emphasizing community engagement for sustainable cities.',
  },
  mentorship: {
    intro: 'Science is deeply collaborative. My mentorship philosophy is rooted in creating inclusive spaces where diverse voices can shape ecological research.',
    para2: 'I actively seek to support emerging scholars, particularly from underrepresented backgrounds in ecology. Whether through formal supervision, field training, or collaborative analysis, I believe in empowering the next generation of conservation scientists to lead with rigor and empathy.',
    quote: 'Ecology needs diverse perspectives to solve complex environmental challenges. The best science happens when everyone has a seat at the table.',
    application: 'Please reach out if you are interested in urban bioacoustics, plant-animal interactions, or community science. I welcome prospective graduate students, postdocs, and collaborators. Send me an email at iar32@cornell.edu with a brief description of your interests.',
  },
  outreach: {
    email: 'iar32@cornell.edu',
    institution: 'K. Lisa Yang Center for Conservation Bioacoustics, Cornell Lab of Ornithology',
    location: 'Ithaca, NY, USA',
    intro: 'Whether you\'re a prospective student, a potential collaborator, or just interested in urban ecology and bioacoustics, I\'d love to hear from you.',
    community_text: 'I am committed to making science accessible and relevant to communities. I regularly engage with citizen science initiatives, school programs, and public lectures.',
    linkedin: 'https://www.linkedin.com/in/islamiat-raji-adebayo-ph-d-21931387/',
    researchgate: '',
    google_scholar: '',
  },
  opportunities: {
    intro: 'I am always looking for motivated and curious students and collaborators to join my research group. I am particularly interested in working with people who are passionate about urban ecology, bioacoustics, and conservation biology.',
    contact_cta: 'To express interest, please email iar32@cornell.edu with your CV, a brief statement of research interests, and any relevant experience.',
  },
};

export const LIST_DEFAULTS: Record<string, Array<Record<string, string>>> = {
  education: [
    { degree: 'PhD Ecological Sciences', institution: 'University of KwaZulu-Natal, 2021' },
    { degree: 'MSc Conservation Biology', institution: 'A.P. Leventis Ornithological Research Institute / University of Jos, 2018' },
    { degree: 'BSc Forestry and Wildlife Management', institution: 'University of Ilorin, 2015' },
  ],
  awards: [
    { title: 'Falling Walls Female Science Talent', year: '2024' },
    { title: 'National Postdoctoral Association IMPACT Fellow', year: '2024' },
    { title: 'NRF-TWAS Scholar', year: '' },
  ],
  affiliations: [
    { name: 'American Scientific Affiliation' },
    { name: 'Society for Conservation Biology (Global & Nigeria)' },
    { name: 'British Ecological Society' },
    { name: 'Stable Planet Alliance' },
  ],
  research_projects: [
    {
      image: '',
      status: 'Current Project',
      title: 'Urban Campus Soundscape Project',
      location: 'Cornell University, Ithaca NY',
      description: 'Using autonomous acoustic recorders deployed across university campuses and cities in multiple countries, this project investigates bird diversity in rapidly changing urban landscapes. I collaborate with local experts and students to record bird songs—identifying which species persist, which do not, and why—to understand the factors that shape urban bird populations and guide conservation planning.',
      methods: 'Autonomous acoustic recorders, Community science, Bioacoustics analysis',
    },
    {
      image: '',
      status: 'Past Project',
      title: 'Multi-country Urban Bird Monitoring',
      location: "Queen's University, Canada",
      description: 'As a Postdoctoral Research Fellow at Queen\'s University, I coordinated a global urban bird survey project spanning five countries — Brazil, Canada, France, Kenya, and Senegal. The project used passive acoustic recorders and an innovative Community Science approach, actively involving local experts and the public in data collection. The aim was to promote human–wildlife coexistence while addressing geographic and methodological gaps in urban ecology research.',
      methods: 'Passive acoustic recorders, Community science, Comparative ecology',
    },
    {
      image: '',
      status: 'Doctoral Research',
      title: 'Frugivory & Seed Dispersal in Urban Mosaics',
      location: 'University of KwaZulu-Natal, South Africa',
      description: 'My doctoral research focused on frugivory and seed dispersal by birds, bats, and monkeys in urban mosaic landscapes, with particular attention to the ecological role of Ficus species. The work demonstrated how habitat fragmentation disrupts mutualistic plant–animal interactions, with significant implications for forest regeneration in heavily modified environments.',
      methods: 'Field surveys, Plant-animal interaction networks, Frugivory analysis',
    },
  ],
  publications: [
    {
      title: 'Urban soundscapes reveal complex patterns of avian community composition across a socioeconomic gradient',
      authors: 'Raji-Adebayo, I., Smith, J.T., & Doe, E.',
      journal: 'Landscape and Urban Planning',
      year: '2024',
      category: 'Journal Article',
      url: '#',
    },
    {
      title: 'Frugivory and seed dispersal networks in fragmented urban green spaces: implications for forest regeneration',
      authors: 'Raji-Adebayo, I., Ndlovu, M., & Downs, C.T.',
      journal: 'Oecologia',
      year: '2022',
      category: 'Journal Article',
      url: '#',
    },
    {
      title: 'Acoustic indices as proxies for biodiversity in rapidly urbanizing African cities',
      authors: 'Raji-Adebayo, I., & Adeyanju, T.E.',
      journal: 'Ecological Indicators',
      year: '2021',
      category: 'Journal Article',
      url: '#',
    },
    {
      title: 'Avian responses to noise pollution: evidence from a multi-city comparative study',
      authors: 'Smith, J.T., Raji-Adebayo, I., & Johnson, R.',
      journal: 'Global Ecology and Conservation',
      year: '2020',
      category: 'Journal Article',
      url: '#',
    },
  ],
  news_items: [
    {
      date: '2025',
      title: 'Joined Cornell Lab as Rose Postdoctoral Fellow',
      description: 'Excited to begin my fellowship at the K. Lisa Yang Center for Conservation Bioacoustics, Cornell Lab of Ornithology, advancing interdisciplinary research on urban bird diversity and soundscapes.',
    },
    {
      date: '2024',
      title: 'Multi-country urban bird monitoring project complete',
      description: 'Wrapped up the global urban bird survey project across five countries — Brazil, Canada, France, Kenya, and Senegal — at Queen\'s University, with data analysis and manuscript preparation now underway.',
    },
    {
      date: '2024',
      title: 'Fieldwork season completed in South Africa',
      description: 'Concluded field data collection on frugivory and seed dispersal networks by birds, bats, and monkeys in urban mosaic landscapes, focusing on the ecological role of Ficus species.',
    },
    {
      date: '2021',
      title: 'PhD conferred — University of KwaZulu-Natal',
      description: 'Completed doctoral research in Ecological Sciences, focusing on plant–animal interactions and seed dispersal in fragmented urban landscapes in South Africa.',
    },
  ],
  mentorship_roles: [
    {
      title: 'Collaborators',
      description: 'Always open to interdisciplinary collaborations crossing ecology, urban planning, and community science.',
    },
    {
      title: 'Prospective Graduate Students',
      description: 'Please reach out if you are interested in urban bioacoustics or plant-animal interactions. I welcome MSc and PhD applicants with a passion for field ecology.',
    },
  ],
  opportunities_list: [],
};
