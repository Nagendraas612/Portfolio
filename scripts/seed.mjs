import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';

// Helper to parse .env.local
function getEnvVar(name) {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) return null;
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(new RegExp(`^${name}=(.*)$`, 'm'));
    return match ? match[1].trim() : null;
  } catch (e) {
    console.error(`Failed to read env var ${name}:`, e);
    return null;
  }
}

const projectId = getEnvVar('NEXT_PUBLIC_SANITY_PROJECT_ID') || '5hujwuzl';
const dataset = getEnvVar('NEXT_PUBLIC_SANITY_DATASET') || 'production';
const token = getEnvVar('SANITY_API_TOKEN');

if (!token) {
  console.error('❌ Error: SANITY_API_TOKEN is not defined in .env.local.');
  console.log('Please ensure SANITY_API_TOKEN is added to .env.local and has write permissions.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

async function uploadImage(filePath) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ Image not found at path: ${absolutePath}`);
    return null;
  }
  console.log(`📤 Uploading image: ${filePath}...`);
  try {
    const fileStream = fs.createReadStream(absolutePath);
    const asset = await client.assets.upload('image', fileStream, {
      filename: path.basename(filePath),
    });
    console.log(`✅ Uploaded image successfully: ${asset._id}`);
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
  } catch (error) {
    console.error(`❌ Failed to upload image ${filePath}:`, error.message);
    throw error;
  }
}

async function seed() {
  console.log('🚀 Starting Sanity database seed...');
  console.log(`Project ID: ${projectId}`);
  console.log(`Dataset: ${dataset}`);

  try {
    // 1. Upload assets
    const profilePhoto = await uploadImage('public/assets/Nagendra.jpg');
    const ffScreenshot = await uploadImage('public/assets/FaceFetch.png');
    const seatingScreenshot = await uploadImage('public/assets/seating.png');

    // 2. Create Site Settings
    console.log('✍️ Seeding siteSettings...');
    const siteSettingsDoc = {
      _type: 'siteSettings',
      _id: 'siteSettings',
      name: 'Nagendra AS',
      title: 'Nagendra AS — Creative Developer',
      metaDescription: 'CS student specializing in AI, ML',
      heroTagline: 'I build *intelligent systems.*',
      heroSubtitle: 'CS student · AI & ML · VVCE',
      availabilityText: 'Available for opportunities · 2026',
      email: 'nagendraas612@gmail.com',
      githubUrl: 'https://github.com/Nagendraas612',
      linkedinUrl: 'https://linkedin.com/in/nagendraas612',
      contactHeadline: "Let's build\nsomething great.",
      contactSubhead: "CS student with a sharp eye for AI-powered solutions and a bias for shipping. If you have a project, an idea, or an open role — I'm listening.",
      avgResponse: '24h',
      location: 'India',
      openTo: ['Internships', 'Freelancing', 'Open source', 'Project collaborations'],
    };
    await client.createOrReplace(siteSettingsDoc);
    console.log('✅ Seeded siteSettings');

    // 3. Create About document
    console.log('✍️ Seeding about...');
    const aboutDoc = {
      _type: 'about',
      _id: 'about',
      profilePhoto,
      role: 'CS student & developer, building at the intersection of AI, automation, and thoughtful design.',
      roleEmphasis: 'AI, automation, and thoughtful design.',
      bio: "I care about the intersection of technical precision and real-world impact. Every project I take on — from facial recognition to exam management systems — starts with a question: how can this make someone's day measurably better? I thrive in collaborative environments and believe the best code is the code nobody has to think about.",
      bioEmphasis: "how can this make someone's day measurably better?",
      basedIn: 'India 🇮🇳',
      status: 'Open to work',
      education: 'VVCE · CS',
      focus: 'AI & ML',
    };
    await client.createOrReplace(aboutDoc);
    console.log('✅ Seeded about');

    // 4. Create Projects
    console.log('✍️ Seeding projects...');
    const projects = [
      {
        _type: 'project',
        _id: 'project-facefetch',
        title: 'FaceFetch',
        slug: { _type: 'slug', current: 'facefetch' },
        orderIndex: 1,
        type: 'Event Tech Platform',
        status: 'completed',
        year: '2025',
        screenshot: ffScreenshot,
        shortDescription: 'AI-powered event photo retrieval',
        longDescription: 'AI-powered event photo retrieval. Attendees upload a selfie and instantly surface every photo of themselves from thousands of event images — using facial recognition at scale. Built for speed, accuracy, and seamless attendee UX.',
        tags: ['Computer Vision', 'Facial Recognition', 'AI Search', 'UX Design'],
        deployedUrl: 'https://eventai-w89h.onrender.com/',
        githubUrl: '',
        impactStats: [
          { _key: 'stat-1', value: '1000s', label: 'Photos scanned' },
          { _key: 'stat-2', value: '<2s', label: 'Retrieval time' },
          { _key: 'stat-3', value: 'AI', label: 'Face matching' },
        ],
      },
      {
        _type: 'project',
        _id: 'project-aiml-exam-system',
        title: 'AIML Exam System',
        slug: { _type: 'slug', current: 'seating' },
        orderIndex: 2,
        type: 'Education Platform',
        status: 'completed',
        year: '2025',
        screenshot: seatingScreenshot,
        shortDescription: 'Full-stack examination management platform',
        longDescription: 'Full-stack examination management platform with intelligent seating algorithms, anti-copy pattern generation, OAuth 2.0 secure authentication, and automated PDF generation. Built for academic institutions that need reliability at scale.',
        tags: ['Workflow Automation', 'Smart Algorithms', 'Secure Auth', 'PDF Generation'],
        deployedUrl: 'https://seating-dak2.onrender.com/',
        githubUrl: '',
        impactStats: [
          { _key: 'stat-1', value: 'Auto', label: 'Seating logic' },
          { _key: 'stat-2', value: 'OAuth', label: 'Secure login' },
          { _key: 'stat-3', value: 'PDF', label: 'Auto-generated' },
        ],
      },
    ];

    for (const project of projects) {
      await client.createOrReplace(project);
      console.log(`✅ Seeded project: ${project.title}`);
    }

    // 5. Create Skill Categories
    console.log('✍️ Seeding skillCategories...');
    const skillCategories = [
      {
        _type: 'skillCategory',
        _id: 'skill-frontend',
        title: 'Frontend',
        orderIndex: 1,
        skills: ['HTML & CSS', 'JavaScript', 'React.js', 'Responsive Design'],
      },
      {
        _type: 'skillCategory',
        _id: 'skill-aiml',
        title: 'AI & ML',
        orderIndex: 2,
        skills: ['Python', 'Machine Learning', 'Computer Vision', 'Data Analysis'],
      },
      {
        _type: 'skillCategory',
        _id: 'skill-backend',
        title: 'Backend',
        orderIndex: 3,
        skills: ['Node.js · Express', 'MongoDB', 'Java', 'REST APIs'],
      },
      {
        _type: 'skillCategory',
        _id: 'skill-tools',
        title: 'Tools',
        orderIndex: 4,
        skills: ['Git · GitHub', 'VS Code', 'Figma', 'Linux'],
      },
    ];

    for (const cat of skillCategories) {
      await client.createOrReplace(cat);
      console.log(`✅ Seeded skill category: ${cat.title}`);
    }

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    if (error.message && error.message.includes('insufficient permissions')) {
      console.log('\n💡 Hint: It seems your SANITY_API_TOKEN is a read-only token.');
      console.log('To run this seeding script, you need a write token:');
      console.log('1. Go to https://www.sanity.io/manage');
      console.log('2. Click on your project ("production")');
      console.log('3. Go to API -> Tokens');
      console.log('4. Create a new token with "Write" or "Editor" permissions');
      console.log('5. Paste that token into .env.local as SANITY_API_TOKEN');
    }
  }
}

seed();
