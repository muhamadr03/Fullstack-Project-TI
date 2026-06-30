import React from "react";

const TEAM_MEMBERS = [
  {
    name: "Muhamad Rojali",
    role: "Fullstack Developer",
    photo: "team/rojali.jpeg",
    linkedin: "#",
    github: "https://github.com/muhamadr03",
  },
  {
    name: "Akmal Maulana",
    role: "Fullstack Developer",
    photo: "team/akmal.jpeg",
    linkedin: "#",
    github: "https://github.com/mwlnnaa",
  },
  {
    name: "Rama Aditia",
    role: "Fullstack Developer",
    photo: "team/rama.png",
    linkedin: "#",
    github: "https://github.com/Ramaaditia123",
  },
  {
    name: "Salsabila",
    role: "Fullstack Developer",
    photo: "team/caca.jpeg",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Nur Indah",
    role: "Fullstack Developer",
    photo: "team/indah.jpeg",
    linkedin: "#",
    github: "#",
  },
];

const TeamSection = () => {
  return (
    <section className="lx-section team-section" style={{ padding: "64px 0", background: "var(--bg)" }}>
      <div className="container-xl px-3 text-center">
        <span className="section-eyebrow d-block mb-2">Tim Kami</span>
        <h2 className="section-heading mb-3">Pengembang ShopKu</h2>
        <p className="section-sub mx-auto mb-5" style={{ maxWidth: "600px" }}>
          Kenali tim developer berbakat di balik layar aplikasi e-commerce ini. 
          Berdedikasi untuk memberikan pengalaman belanja online terbaik.
        </p>

        <div className="team-grid">
          {TEAM_MEMBERS.map((member, i) => (
            <div key={i} className="team-card">
              <div className="team-img-wrap">
                <img 
                  src={member.photo} 
                  alt={member.name} 
                  className="team-img" 
                  loading="lazy" 
                  title="Ganti foto melalui src di kode TeamSection.jsx"
                />
                <div className="team-social-overlay">
                  <a href={member.github} className="team-social-link" aria-label="Github"><i className="bi bi-github" /></a>
                  <a href={member.linkedin} className="team-social-link" aria-label="LinkedIn"><i className="bi bi-linkedin" /></a>
                </div>
              </div>
              <div className="team-info">
                <h4 className="team-name">{member.name}</h4>
                <span className="team-role">{member.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
