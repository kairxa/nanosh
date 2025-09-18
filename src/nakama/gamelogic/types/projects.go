package types

type ProjectName string

const (
	ProjectFileG11ApexBioEnhancement               ProjectName = "File G11 - Apex Bio Enhancement"
	ProjectFile128FinesseProtocol                  ProjectName = "File 128 - Finesse Protocol"
	ProjectFile129EquilibriumDrive                 ProjectName = "File 129 - Equilibrium Drive"
	ProjectFile252HyperHealAmpoule                 ProjectName = "File 252 - HyperHeal Ampoule"
	ProjectFile253LifesaverInitiative              ProjectName = "File 253 - Lifesaver Initiative"
	ProjectFile254OperationalSurgeParadigm         ProjectName = "File 254 - Operational Surge Paradigm"
	ProjectFile311ProvisioningOverhaul             ProjectName = "File 311 - Provisioning Overhaul"
	ProjectFileE120SoloComfortInitiative           ProjectName = "File E120 - Solo Comfort Initiative"
	ProjectFile100SupportBlueprintsRecoveryA       ProjectName = "File 100 - Support Blueprints Recovery A"
	ProjectFile101SupportBlueprintsRecoveryB       ProjectName = "File 101 - Support Blueprints Recovery B"
	ProjectFile112EisenSchlagModul                 ProjectName = "File 112 - EisenSchlag Modul"
	ProjectFile113BiogenicAimAssist                ProjectName = "File 113 - Biogenic Aim Assist"
	ProjectFile456KabutoBoost                      ProjectName = "File 456 - Kabuto Boost"
	ProjectFile010BuzzardPrecisionUpgrade          ProjectName = "File 010 - M22 \"Buzzard\" Precision Upgrade"
	ProjectFile011BuzzardStrikeOptimization        ProjectName = "File 011 - M22 \"Buzzard\" Strike Optimization"
	ProjectFile012BuzzardDefensiveRetrofit         ProjectName = "File 012 - M22 \"Buzzard\" Defensive Retrofit"
	ProjectFile055HoppersSpaceOptimization         ProjectName = "File 055 - Hoppers Space Optimization"
	ProjectFile711PraetoriansSuitForceDistribution ProjectName = "File 711 - Praetorians Suit Force Distribution"
	ProjectFile712YsarasSnare                      ProjectName = "File 712 - Ysara's Snare"
	ProjectFileNAPNanoshAssimilationProtocol       ProjectName = "File NAP - Nanosh Assimilation Protocol"
)

type ProjectType string

const (
	ProjectTypeBio    ProjectType = "Bio"
	ProjectTypeTechGi ProjectType = "TechGi"
)

type ProjectDetails struct {
	Type              map[ProjectType]bool       `json:"type"`
	ProgressNeeded    int                        `json:"progressNeeded"`
	CompletedCallback func(*Game) (*Game, error) `json:"-"` // Function pointer, not serialized
}

type ProjectProgress struct {
	ProgressCurrent int `json:"progressCurrent"`
}
