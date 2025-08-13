'use client';

import { Anchor, Col, Row, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const sections = [
  {
    id: 'scope-of-application',
    title: '1. Scope of application, acceptance and eligibility',
    content: [
      'By accessing the Platform or using our Services, you are giving consent that this T&C (as modified from time to time by Sendbypass, as defined below) will automatically apply to you and the relationship between you and Sendbypass, and you will be bound by it accordingly.',
      'You further acknowledge that you have read, understood, and agreed to this T&C and our Policies. You also confirm that you are 18 years old or above to use our Services. By using our Services, you represent and warrant that you have the legal capacity and authority to agree and consent to this T&C.',
      'Sendbypass reserves the right to modify this T&C (and subsequent modifications) at any time. Changes and modifications of any kind and nature will be effective immediately upon posting on our website. Your continued use of our Platform or Services after any modifications indicates your acceptance of and consent to the modified T&C.',
      'Sendbypass may at its sole discretion (including after the death of a User) terminate your Account and prevent you from accessing the Platform and from the Use without the need for prior notice to you and without being obligated to pay any damages or make any other remedy of any type or form.',
    ],
  },
  {
    id: 'definitions',
    title: '2. Definitions',
    content: [
      'Account: a profile account in the Platform created by a User.',
      'Application: Any PC (Windows or Mac) or mobile application (iOS and Android) of Sendbypass.',
      'Costs: any costs and charges borne by any User for the Use.',
      'Consent: a User’s consent given unconditionally and irrevocably to Sendbypass on any occasion stipulated in this T&C.',
      'Effective Date: the date when this T&C was last updated and made effective.',
      'Fees: all charges incurred by the User for the use of Services, including any fees, taxes, and other costs associated with using the Platform.',
      'Platform: the online platform provided by Sendbypass to facilitate the Services.',
      'Services: the services provided by Sendbypass, including but not limited to air cargo services facilitated by the Platform.',
      'User: any individual or entity using the Platform, including both travelers and customers.',
    ],
  },
  {
    id: 'services',
    title: '3. Services',
    content: [
      'We provide an online platform that connects travelers who are willing to carry air cargo with individuals or businesses that need to send cargo by using the Platform. Sendbypass acts solely as an intermediary and is not responsible for the actual transportation of cargo. Details of the Services are described on the Website which may vary from time to time.',
      'Sendbypass reserves the right to modify, suspend, or discontinue any of the Services at any time, without notice, and without liability to you or any third party.',
    ],
  },
  {
    id: 'user-responsibilities',
    title: '4. User responsibilities',
    content: [
      'As a User, you are responsible for the following:',
      '1. Providing accurate, current, and complete information when using the Platform or Services.',
      '2. Maintaining the confidentiality of your account and login information.',
      '3. Complying with all applicable laws and regulations while using the Platform.',
      '4. Not using the Platform for any unlawful purpose or for any purpose that could damage, disable, or impair the Platform.',
      "5. Ensuring that your use of the Platform does not interfere with other Users' ability to use the Platform.",
    ],
  },
  {
    id: 'prohibitions',
    title: '5. Prohibitions',
    content: [
      'You may not:',
      '1. Use the Platform for any fraudulent, illegal, or unlawful purpose.',
      '2. Harass, defame, abuse, or threaten other Users of the Platform.',
      '3. Upload or transmit any harmful software or malicious code that could disrupt the Platform.',
      '4. Impersonate any individual or entity or falsely represent your affiliation with any entity.',
      '5. Engage in any activity that would violate the intellectual property rights of Sendbypass or any third party.',
    ],
  },
  {
    id: 'fees-and-payment',
    title: '6. Fees and payment',
    content: [
      'The use of certain features or Services may require payment of fees. The payment terms are outlined as follows:',
      '1. All fees and charges will be specified on the Platform at the time of use.',
      '2. Payments for Services must be made through the payment methods available on the Platform.',
      '3. Sendbypass reserves the right to modify the fees and charges at any time, and such modifications will be effective immediately upon posting on the Platform.',
    ],
  },
  {
    id: 'disclaimers',
    title: '7. Disclaimers',
    content: [
      'Sendbypass provides the Platform and Services as is without any warranties of any kind, either express or implied. We do not guarantee that the Platform will be free from errors or interruptions.',
      'We also disclaim any liability for any damages that result from the use of the Platform or Services, including any direct, indirect, incidental, or consequential damages.',
    ],
  },
  {
    id: 'limitation-of-liability',
    title: '8. Limitation of liability',
    content: [
      'To the maximum extent permitted by law, Sendbypass shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or in connection with the use of the Platform or Services.',
      'In no event shall our total liability exceed the amount you have paid for the Services during the six (6) months preceding the event that caused the liability.',
    ],
  },
  {
    id: 'third-party-relations',
    title: '9. Third-party relations',
    content: [
      'The Platform may contain links to third-party websites or services. We are not responsible for the content or privacy practices of such third-party sites or services.',
      'Your interactions with third-party providers are solely between you and the third party. We shall not be liable for any loss or damage incurred by you as a result of such interactions.',
    ],
  },
  {
    id: 'indemnification',
    title: '10. Indemnification',
    content: [
      'You agree to indemnify and hold harmless Sendbypass, its affiliates, employees, and agents from any claims, damages, liabilities, and expenses arising from your use of the Platform or Services, your violation of these Terms and Conditions, or your violation of any third-party rights.',
    ],
  },
  {
    id: 'governing-law',
    title: '11. Governing law',
    content: [
      'These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which Sendbypass operates. Any legal action or proceeding related to this agreement shall be conducted in the appropriate courts in that jurisdiction.',
    ],
  },
  {
    id: 'dispute-settlement',
    title: '12. Dispute settlement',
    content: [
      'Any disputes arising out of or in connection with these Terms and Conditions shall be resolved through amicable negotiations between the parties.',
      'If the dispute cannot be resolved amicably, it shall be submitted to binding arbitration in accordance with the rules of the jurisdiction where Sendbypass operates.',
    ],
  },
  {
    id: 'miscellaneous',
    title: '13. Miscellaneous',
    content: [
      'These Terms and Conditions constitute the entire agreement between you and Sendbypass regarding the use of the Platform and Services.',
      'If any provision of these Terms and Conditions is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.',
    ],
  },
  {
    id: 'contact-and-queries',
    title: '14. Contact and queries',
    content: [
      'For any questions or queries or request for clarification regarding this T&C or our Policies and their interpretation or application, please email us at info@sendbypass.com or call us on +37069391091 during office hours in Lithuania, from 9am to 5pm on working days.',
    ],
  },
];

export const TermsOfService = () => {
  return (
    <Row id="table-of-contents">
      <Col span={8} className="hidden md:block">
        <Title level={5} className="font-bold text-gray-800">
          Table of content
        </Title>
        <Anchor
          affix={false}
          items={sections.map((section) => ({
            key: section.id,
            href: `#${section.id}`,
            title: section.title,
          }))}
          offsetTop={160}
        />
      </Col>
      <Col span={16}>
        {sections.map((section) => (
          <div id={section.id} key={section.id}>
            <Title level={5}>{section.title}</Title>
            {section.content.map((para, index) => (
              <Paragraph key={para}>{para}</Paragraph>
            ))}
          </div>
        ))}
      </Col>
    </Row>
  );
};
