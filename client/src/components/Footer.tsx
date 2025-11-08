export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">CineStream</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Acerca de</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Empleos</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Ayuda</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Centro de ayuda</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Contacto</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Privacidad</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Términos de uso</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Social</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Facebook</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2024 CineStream. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
