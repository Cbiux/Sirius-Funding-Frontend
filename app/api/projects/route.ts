import { NextResponse } from 'next/server';
import { db } from '@/app/firebase/config';
import { collection, addDoc, getDocs, DocumentData } from 'firebase/firestore';

interface ProjectData {
  projectId: string;
  creator: string;
  goal: string;
  deadline: string;
  imageBase64?: string; // Campo opcional para la imagen en Base64
  description: string; // Nuevo campo
  donationsXLM: string; // Campo para el total de donaciones
}

export async function POST(request: Request) {
  try {
    let projectData: ProjectData;

    try {
      projectData = await request.json();
    } catch (error) {
      console.error('Error al procesar los datos:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Error al procesar los datos',
          error: error instanceof Error ? error.message : 'Error desconocido'
        },
        { status: 400 }
      );
    }

    // Validar campos requeridos
    if (!projectData.projectId || !projectData.creator || !projectData.goal || !projectData.deadline || !projectData.description) {
      return NextResponse.json(
        {
          success: false,
          message: 'Todos los campos son requeridos',
          received: projectData
        },
        { status: 400 }
      );
    }

    // Validar tamaño de la imagen en Base64 (si existe)
    if (projectData.imageBase64) {
      // Calcular el tamaño aproximado en bytes (1 caracter Base64 = 0.75 bytes)
      const sizeInBytes = (projectData.imageBase64.length * 0.75);
      const sizeInMB = sizeInBytes / (1024 * 1024);
      
      if (sizeInMB > 5) {
        return NextResponse.json(
          {
            success: false,
            message: 'La imagen es demasiado grande (máximo 5MB)'
          },
          { status: 400 }
        );
      }
    }

    // Crear el documento del proyecto con donaciones inicializadas en 0
    const projectRef = await addDoc(collection(db, 'projects'), {
      ...projectData,
      donationsXLM: '0', // Inicializar donaciones en 0
      deadline: new Date(projectData.deadline),
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Proyecto creado exitosamente',
      projectId: projectRef.id
    });

  } catch (error) {
    console.error('Error al crear el proyecto:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al crear el proyecto',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const projectsRef = collection(db, 'projects');
    const projectsSnapshot = await getDocs(projectsRef);
    const projects = projectsSnapshot.docs.map((doc: DocumentData) => ({
      id: doc.id,
      ...doc.data(),
      donationsXLM: doc.data().donationsXLM || '0', // Asegurar que siempre haya un valor para donaciones
      deadline: doc.data().deadline?.toDate(), // Convertir Timestamp a Date
    }));

    return NextResponse.json({ 
      success: true, 
      projects 
    });

  } catch (error) {
    console.error('Error al obtener los proyectos:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al obtener los proyectos',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
} 