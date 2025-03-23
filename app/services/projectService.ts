import { db, storage } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface ProjectData {
  projectId: string;
  creator: string;
  goal: string;
  deadline: Date | null;
  imageUrl?: string;
  createdAt: Date;
}

export const createProject = async (
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