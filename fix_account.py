import sys

file_path = "src/pages/portal/Account.tsx"
with open(file_path, "r") as f:
    lines = f.readlines()

start_line = -1
end_line = -1

for i, line in enumerate(lines):
    if "function EditProfileDialog" in line:
        start_line = i
    if start_line != -1 and line.strip() == "}":
        # Check if this is the end of EditProfileDialog
        # In this file, EditProfileDialog ends before TabButton
        if i + 2 < len(lines) and "function TabButton" in lines[i+2]:
            end_line = i
            break

if start_line == -1 or end_line == -1:
    # Try another way if the above failed due to my previous mess up
    # My previous mess up might have changed the file significantly
    # Let's search for "function EditProfileDialog" and "function TabButton"
    for i, line in enumerate(lines):
        if "function EditProfileDialog" in line:
            start_line = i
        if "function TabButton" in line:
            end_line = i - 1
            while end_line >= 0 and lines[end_line].strip() == "":
                end_line -= 1
            break

if start_line == -1 or end_line == -1:
    print(f"Could not find EditProfileDialog boundaries: {start_line} to {end_line}")
    sys.exit(1)

new_component = """function EditProfileDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<"phone" | "address">("phone");
  const [saving, setSaving] = useState(false);

  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("");

  const [addr, setAddr] = useState({
    address_line1: "",
    address_line2: "",
    address_city: "",
    address_region: "",
    address_postcode: "",
    address_country: "",
    proof_of_address_type: "" as ProofOfAddressType | "",
    proof_of_address_issued_on: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!open || !profile) return;
    setTab("phone");
    setPhone(profile.phone ?? "");
    setPhoneCode(profile.phone_country_code ?? "");
    setAddr({
      address_line1: profile.address_line1 ?? "",
      address_line2: profile.address_line2 ?? "",
      address_city: profile.address_city ?? "",
      address_region: profile.address_region ?? "",
      address_postcode: profile.address_postcode ?? "",
      address_country: profile.address_country ?? profile.country ?? "",
      proof_of_address_type: "" as ProofOfAddressType | "",
      proof_of_address_issued_on: "",
    });
    setFile(null);
  }, [open, profile]);

  const phoneChanged = useMemo(() => {
    if (!profile) return false;
    return phone !== (profile.phone ?? "") || phoneCode !== (profile.phone_country_code ?? "");
  }, [phone, phoneCode, profile]);

  const savePhone = async () => {
    if (!profile || !phoneChanged) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ phone, phone_country_code: phoneCode })
      .eq("id", profile.id);
    setSaving(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: "Contact number updated" });
    await refreshProfile();
    onOpenChange(false);
  };

  const saveAddress = async () => {
    if (!profile) return;
    if (!addr.address_line1 || !addr.address_city || !addr.address_postcode || !addr.address_country) {
      return toast({ title: "Missing address", description: "Please complete all required address fields.", variant: "destructive" });
    }
    if (!addr.proof_of_address_type || !addr.proof_of_address_issued_on) {
      return toast({ title: "Missing document details", description: "Select a document type and issue date for your new proof of address.", variant: "destructive" });
    }
    if (!file) {
      return toast({ title: "New proof required", description: "Please upload a new proof of address to re-verify.", variant: "destructive" });
    }
    if (!ALLOWED_MIMES.includes(file.type)) {
      return toast({ title: "Unsupported file", description: "Use PDF, JPG, PNG or WebP.", variant: "destructive" });
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      return toast({ title: "File too large", description: `Max ${MAX_FILE_MB}MB.`, variant: "destructive" });
    }

    setSaving(true);
    const ext = file.name.split(".").pop() || "bin";
    const newPath = f"{profile.id}/address-{Date.now() if 'Date.now()' else 'dummy'}.{ext}" # Wait, Date.now() is JS
    # I will just keep the original logic for saveAddress
    
    # Actually, I have the original code in my thought buffer. Let me just copy it exactly.
    pass

# Refined approach: I will just use a more reliable string replacement for the whole function.
