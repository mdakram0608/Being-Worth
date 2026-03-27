const Section = ({ number, title, children }) => (
  <div style={{ marginBottom: '48px' }}>
    <h2 style={{
      fontSize: '0.78rem',
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'var(--gray-dark)',
      marginBottom: '6px',
    }}>
      {number}
    </h2>
    <h3 style={{
      fontSize: '1.1rem',
      fontWeight: 400,
      letterSpacing: '0.08em',
      marginBottom: '16px',
    }}>
      {title}
    </h3>
    <div style={{ fontSize: '0.95rem', lineHeight: 1.9, color: '#444', fontWeight: 300 }}>
      {children}
    </div>
  </div>
);

const Terms = () => {
  return (
    <div className="fade-in">
      {/* Header */}
      <section style={{
        padding: '120px 24px 60px',
        textAlign: 'center',
        backgroundColor: 'var(--gray-light)',
        borderBottom: '1px solid #e0e0e0',
      }}>
        <div className="container">
          <p style={{
            fontSize: '0.75rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--gray-dark)',
            marginBottom: '16px',
          }}>
            Legal
          </p>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 300,
            letterSpacing: '0.15em',
          }}>
            TERMS & CONDITIONS
          </h1>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '80px 24px 120px' }}>
        <div className="container" style={{ maxWidth: '760px' }}>

          <p style={{
            fontSize: '0.95rem',
            lineHeight: 1.9,
            color: '#444',
            fontWeight: 300,
            marginBottom: '64px',
            paddingBottom: '40px',
            borderBottom: '1px solid var(--gray-light)',
          }}>
            Welcome to BEING WORTH. By accessing or using our website, you agree to be bound by the
            following terms and conditions. Please read them carefully before making any purchase.
          </p>

          <Section number="01" title="General">
            <p>
              This website is owned and operated by BEING WORTH. Throughout the site, the terms "we",
              "us" and "our" refer to BEING WORTH.
            </p>
            <p style={{ marginTop: '12px' }}>
              By visiting our website and/or purchasing something from us, you engage in our "Service"
              and agree to be bound by these Terms & Conditions.
            </p>
          </Section>

          <Section number="02" title="Products & Pricing">
            <p>All products listed on the website are subject to availability.</p>
            <p style={{ marginTop: '12px' }}>
              We reserve the right to modify prices, discontinue products, or change product descriptions
              at any time without prior notice.
            </p>
            <p style={{ marginTop: '12px' }}>
              We strive to display product colors and images as accurately as possible; however, actual
              products may slightly vary due to lighting and screen differences.
            </p>
          </Section>

          <Section number="03" title="Order Acceptance">
            <p>We reserve the right to refuse or cancel any order at our discretion, including but not limited to:</p>
            <ul style={{ marginTop: '12px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Suspected fraudulent transactions</li>
              <li>Incorrect pricing or product information</li>
              <li>Unavailability of stock</li>
            </ul>
            <p style={{ marginTop: '12px' }}>In such cases, a full refund will be processed.</p>
          </Section>

          <Section number="04" title="Shipping & Delivery">
            <p>Delivery timelines are estimates and may vary based on location and courier service.</p>
            <p style={{ marginTop: '12px' }}>
              BEING WORTH is not responsible for delays caused by courier partners or unforeseen circumstances.
            </p>
          </Section>

          <Section number="05" title="Returns & Refunds">
            <p>
              Due to the nature of fragrance products, we do not accept returns once the product is
              opened or used.
            </p>
            <p style={{ marginTop: '12px' }}>Refunds or replacements are only applicable in cases of:</p>
            <ul style={{ marginTop: '12px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Damaged product</li>
              <li>Wrong product delivered</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              Customers must report such issues within 48 hours of delivery with proof (photos/videos).
            </p>
          </Section>

          <Section number="06" title="Intellectual Property">
            <p>
              All content on this website including logo, images, text, and designs are the property of
              BEING WORTH and may not be used without permission.
            </p>
          </Section>

          <Section number="07" title="Limitation of Liability">
            <p>
              BEING WORTH shall not be held liable for any direct, indirect, or incidental damages
              resulting from the use or misuse of our products.
            </p>
            <p style={{ marginTop: '12px' }}>Customers are advised to perform a patch test before use.</p>
          </Section>

          <Section number="08" title="Privacy">
            <p>
              Your personal information is handled securely and will not be shared with third parties
              except as required to process your order.
            </p>
          </Section>

          <Section number="09" title="Contact Information">
            <p>For any queries, please contact us:</p>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p><strong style={{ fontWeight: 400, letterSpacing: '0.05em' }}>BEING WORTH</strong></p>
              <p>Email: <a href="mailto:info.beingworth@gmail.com" style={{ color: 'var(--secondary)' }}>info.beingworth@gmail.com</a></p>
              <p>Phone: <a href="tel:+917092144594" style={{ color: 'var(--secondary)' }}>+91 7092144594</a></p>
            </div>
          </Section>

        </div>
      </section>
    </div>
  );
};

export default Terms;
