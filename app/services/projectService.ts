import { db, storage } from '../firebase/config';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface Project {
  id: string;
  projectId: string;
  creator: string;
  goal: number;
  deadline: Date;
  donationsXLM: number;
  description: string;
  imageBase64?: string | null;
  createdAt: Date;
}

export const createProject = async (projectData: Omit<Project, 'id' | 'donationsXLM' | 'createdAt'>): Promise<string> => {
  try {
    // Validar que la fecha límite sea válida
    if (!(projectData.deadline instanceof Date) || isNaN(projectData.deadline.getTime())) {
      throw new Error('Invalid deadline date');
    }

    // Validar que el goal sea un número válido
    if (typeof projectData.goal !== 'number' || isNaN(projectData.goal) || projectData.goal <= 0) {
      throw new Error('Invalid goal amount');
    }

    // Crear el documento del proyecto
    const projectRef = await addDoc(collection(db, 'projects'), {
      ...projectData,
      donationsXLM: 0,
      createdAt: new Date(),
    });

    return projectRef.id;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const getProjects = async (): Promise<Project[]> => {
  try {
    const projectsRef = collection(db, 'projects');
    const projectsSnapshot = await getDocs(projectsRef);
    
    return projectsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      deadline: doc.data().deadline.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      goal: Number(doc.data().goal),
      donationsXLM: Number(doc.data().donationsXLM || 0),
    })) as Project[];
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  try {
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, where('projectId', '==', id));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      deadline: doc.data().deadline.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      goal: Number(doc.data().goal),
      donationsXLM: Number(doc.data().donationsXLM || 0),
    } as Project;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

export interface ProjectData {
  projectId: string;
  creator: string;
  goal: string;
  deadline: Date | null;
  imageUrl?: string;
  createdAt: Date;
}

export const createProjectData = async (
  projectData: Omit<ProjectData, 'imageUrl' | 'createdAt'>,
  imageFile: File | null
): Promise<string> => {
  try {
    let imageUrl = '';
    
    // Si hay una imagen, subirla primero
    if (imageFile) {
      const storageRef = ref(storage, `project-images/${Date.now()}-${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Crear el documento del proyecto
    const projectRef = await addDoc(collection(db, 'projects'), {
      ...projectData,
      imageUrl,
      createdAt: new Date(),
    });

    return projectRef.id;
  } catch (error) {
    console.error('Error al crear el proyecto:', error);
    throw new Error('Error al crear el proyecto en la base de datos');
  }
}; 