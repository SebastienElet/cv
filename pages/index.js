import Head from "next/head";
import { basics, work, skills, education } from "../resume";
import { format } from "date-fns";
import { PropTypes } from "prop-types";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>{basics.name} - NodeJS / Javascript developer</title>
        <meta
          name="description"
          content={`${basics.name} is a NodeJS / Javascript developer with 13 years experience`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Resume {basics.name}</h1>
        <h2>💻 Work</h2>
        <section className="timeline simplifield">
          <ul>
            {work
              .filter(({ company }) => company.toLowerCase() === "simplifield")
              .map((experience, index) => (
                <Experience key={index} {...experience} />
              ))}
          </ul>
        </section>
        <section className="timeline denaroo">
          <ul>
            {work
              .filter(({ company }) => company.toLowerCase() === "denaroo")
              .map((experience, index) => (
                <Experience key={index} {...experience} />
              ))}
          </ul>
        </section>
        <h2>🤹 Skills</h2>
        <section className="skills">
          <ul>
            {skills.map((skill, index) => (
              <Skill key={index} {...skill} />
            ))}
          </ul>
        </section>
        <h2>📚 Education</h2>
        <section className="timeline education">
          <ul>
            {education.map((diploma, index) => (
              <Education key={index} {...diploma} />
            ))}
          </ul>
        </section>
      </main>

      <footer>
        <script
          dangerouslySetInnerHTML={{
            __html: `
           WebFontConfig = {
             google: { families: [ 'Roboto:100' ] }
           };

           (function(d) {
              var wf = d.createElement('script'), s = d.scripts[0];
              wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
              wf.async = true;
              s.parentNode.insertBefore(wf, s);
           })(document);
           `,
          }}
        />
      </footer>

      <style jsx>{``}</style>

      <style jsx global>{`
        html {
          font-size: 100%;
          font: 1.2em/1.5em Text;
        }
        @media (max-width: 640px) {
          html {
            font-size: 100%;
            font: 0.9em/1.2em Text;
          }
        }
        body {
          font-family: "Roboto", sans-serif;
          color: #333;
          text-align: justify;
          margin: 0;
          padding: 0;
        }
        ul {
          margin: 0;
          padding: 0;
        }
        li {
          list-style: none;
          margin-left: 1.5em;
        }
        h1 {
          text-align: center;
          font-size: 2.3em;
          line-height: 4em;
        }
        h2 {
          font-size: 2em;
          font-weight: normal;
          text-align: right;
          margin-right: 1em;
        }
        h3 {
          font-size: 1.5em;
          font-weight: normal;
        }
        section.education,
        section.skills,
        section.denaroo,
        section.simplifield {
          color: #fff;
          background-position: 50% 0;
          background-repeat: no-repeat;
          background-attachment: fixed;
          background-size: cover;
        }
        .simplifield {
          background: url("./images/simplifield.jpg");
        }
        .denaroo {
          background: url("./images/denaroo.jpg");
        }
        .skills {
          background: url("./images/skills.jpg");
        }
        .education {
          background: url("./images/education.jpg");
        }

        section {
          padding-left: 7em;
        }
        section p {
          padding: 0;
          margin: 0;
        }
        section ul {
          padding-top: 0.5em;
          padding-bottom: 0.5em;
        }
        section.timeline {
          position: relative;
        }
        section.timeline::before {
          content: " ";
          display: block;
          position: absolute;
          left: 7em;
          border-left: 2px #eee solid;
          height: 100%;
        }
        li::before {
          position: absolute;
          left: 7em;
          margin-top: 0.7em;
          cursor: default;
          height: 0;
          width: 1.5em;
        }
        section.timeline ul > li::before {
          content: " ";
          border-top: 2px #eee solid;
        }
        section.timeline time {
          position: absolute;
          left: 0.5em;
          width: 6em;
          font-weight: normal;
          text-align: right;
        }
        section.timeline time::after {
          content: " ";
          display: block;
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #eee;
          top: 0.65em;
          left: 100%;
          margin: -4px 0 0 4px;
        }
      `}</style>
    </div>
  );
}

const displayDate = (date) => format(new Date(date), "MMM yyyy");

export function Experience({ company, position, startDate, highlights }) {
  // Use dd/dl/dt
  // <em> {company} - {location} </em>
  return (
    <li>
      <time dateTime="{startDate}">{displayDate(startDate)}</time>
      <h3>
        {position} <em>{company}</em>
      </h3>
      {highlights.map((highlight, index) => (
        <p key={index}>{highlight}</p>
      ))}
    </li>
  );
}
Experience.propTypes = {
  company: PropTypes.string,
  position: PropTypes.string,
  startDate: PropTypes.string,
  highlights: PropTypes.arrayOf(PropTypes.string),
};

export function Skill({ keywords, name }) {
  // Use dd/dl/dt
  // Use abbr
  return (
    <li>
      <strong>{name}</strong>: {keywords.join(" ")}
    </li>
  );
}
Skill.propTypes = {
  name: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
};

export function Education({ endDate, area, studyType }) {
  // Use dd/dl/dt
  return (
    <li>
      <time>{endDate}</time>
      <strong>{studyType}</strong> <i>{area}</i>
    </li>
  );
}
Education.propTypes = {
  endDate: PropTypes.string,
  area: PropTypes.string,
  studyType: PropTypes.string,
};
