import { Agreement } from "./Agreement";
import { OriginalContentProps } from "./types";
export const OriginalContent = ({ setFormSubmitted }: OriginalContentProps) => {
  return (
    <>
      <div className="p-16 bg-informative-opacity-8 rounded-small">
        <div className="text-title-medium text-informative pb-16">
          Important: Data Deletion Requirements
        </div>
        <div className="text-body-medium text-informative pb-32">
          If our app allows account creation, we are committed to providing a
          clear and accessible way for users to request account and associated
          data deletion.
        </div>
        <ul className="pl-8">
          <li className="text-body-medium text-informative flex items-start md:items-center gap-8 mb-2">
            <span className="flex-shrink-0 inline-block rounded-full size-4 bg-informative my-8 md:my-0"></span>
            Upon your request, we will delete all personal data associated with
            your account.
          </li>
          <li className="text-body-medium text-informative flex items-start md:items-center gap-8 mb-2">
            <span className="flex-shrink-0 inline-block rounded-full size-4 bg-informative my-8 md:my-0"></span>
            Temporary deactivation or &quot;freezing&quot; of the account does
            not qualify as deletion.
          </li>
          <li className="text-body-medium text-informative flex items-start md:items-center gap-8 mb-2">
            <span className="flex-shrink-0 inline-block rounded-full size-4 bg-informative my-8 md:my-0"></span>
            Certain data may be retained for legitimate reasons such as
            security, fraud prevention, or regulatory compliance, as outlined in
            our Privacy Policy.
          </li>
          <li className="text-body-medium text-informative flex items-start md:items-center gap-8 mb-2">
            <span className="flex-shrink-0 inline-block rounded-full size-4 bg-informative my-8 md:my-0"></span>
            This web page serves as an external resource for account deletion
            requests, in addition to any in-app options.
          </li>
          <li className="text-body-medium text-informative flex items-start md:items-center gap-8 mb-2">
            <span className="flex-shrink-0 inline-block rounded-full size-4 bg-informative my-8 md:my-0"></span>
            For more details, please review our full Data Deletion Policy.
          </li>
        </ul>
      </div>
      <Agreement setFormSubmitted={setFormSubmitted} />
    </>
  );
};
