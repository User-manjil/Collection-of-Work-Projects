import Button from "@/components/ui/Button"

export default function Contact() {
  return (
    <>
      {/* Hero */}
      <section className="contact">
        <div className="container">
          <p className="text-label">Contact</p>
          <h1 className="contact-title" style={{ marginTop: "16px" }}>
            Let&apos;s work
            <br />
            together
          </h1>
          <a href="mailto:hello@manjilaryal.com" className="contact-email hover-link">
            hello@manjilaryal.com
          </a>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section section-border">
        <div className="container-content">
          <p className="text-label" style={{ marginBottom: "48px" }}>
            Send a Message
          </p>
          <form className="form">
            <div className="form-group">
              <label htmlFor="contact-name" className="form-label">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                className="form-input"
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-email" className="form-label">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                className="form-input"
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-message" className="form-label">
                Message
              </label>
              <textarea
                id="contact-message"
                className="form-textarea"
                placeholder="Tell me about your project..."
              />
            </div>

            <div>
              <Button>Send Message</Button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}