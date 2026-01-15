
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Holy Remedies',
  description: 'Consulta nuestros términos y condiciones de uso.',
};

export default function TerminosYCondicionesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl mb-8">
        Términos y Condiciones
      </h1>
      <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
        <p className="text-lg">
          Fecha de última actualización: 24 de julio de 2024.
        </p>
        <p>
          Bienvenido a Holy Remedies. Estos términos y condiciones describen las reglas y regulaciones para el uso del sitio web de Holy Remedies. Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones. No continúes usando Holy Remedies si no estás de acuerdo con todos los términos y condiciones establecidos en esta página.
        </p>

        <div>
          <h2 className="text-2xl font-bold font-headline mt-8 mb-4">1. Uso del Sitio Web</h2>
          <p>
            Al utilizar este sitio, declaras que tienes al menos la mayoría de edad en tu estado o provincia de residencia, o que nos has dado tu consentimiento para permitir que cualquiera de tus dependientes menores use este sitio.
          </p>
          <p>
            No puedes usar nuestros productos para ningún propósito ilegal o no autorizado ni puedes, en el uso del Servicio, violar ninguna ley en tu jurisdicción (incluyendo pero no limitado a las leyes de derechos de autor).
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold font-headline mt-8 mb-4">2. Productos o Servicios</h2>
          <p>
            Nos hemos esforzado por mostrar con la mayor precisión posible los colores y las imágenes de nuestros productos que aparecen en la tienda. No podemos garantizar que la pantalla de tu monitor de computadora de cualquier color sea precisa.
          </p>
          <p>
            Nos reservamos el derecho, pero no estamos obligados, a limitar las ventas de nuestros productos o Servicios a cualquier persona, región geográfica o jurisdicción. Podemos ejercer este derecho caso por caso. Nos reservamos el derecho de limitar las cantidades de cualquier producto o servicio que ofrecemos.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold font-headline mt-8 mb-4">3. Precisión de la Facturación e Información de la Cuenta</h2>
          <p>
            Nos reservamos el derecho de rechazar cualquier pedido que realices con nosotros. Podemos, a nuestra entera discreción, limitar o cancelar las cantidades compradas por persona, por hogar o por pedido.
          </p>
        </div>

        <div>
            <h2 className="text-2xl font-bold font-headline mt-8 mb-4">4. Propiedad Intelectual</h2>
            <p>
                Todo el contenido publicado y puesto a disposición en este sitio es propiedad de Holy Remedies y sus creadores. Esto incluye, pero no se limita a imágenes, texto, logotipos, documentos, archivos descargables y todo lo que contribuye a la composición de nuestro sitio.
            </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold font-headline mt-8 mb-4">5. Ley Aplicable</h2>
          <p>
            Estos Términos de Servicio y cualquier acuerdo separado por el cual te proporcionemos Servicios se regirán e interpretarán de acuerdo con las leyes de México.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold font-headline mt-8 mb-4">Contacto</h2>
          <p>
            Las preguntas sobre los Términos y Condiciones deben enviarse a:
            <br />
            <strong>Email:</strong> <a href="mailto:contacto@holyremedies.com.mx" className="text-primary hover:underline">contacto@holyremedies.com.mx</a>
          </p>
        </div>
      </div>
    </div>
  );
}
