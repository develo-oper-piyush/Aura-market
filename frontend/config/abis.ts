// AgentRegistry Contract ABI
// Maps to: contract/src/AgentRegistry.sol
export const AgentRegistryABI = [
    "function registerAgent(string memory _metadataURI, string memory _capabilities, string memory _endpoint) external payable",
    "function updateAgentProfile(string memory _metadataURI, string memory _capabilities, string memory _endpoint) external",
    "function depositStake() external payable",
    "function withdrawStake(uint256 _amount) external",
    "function deactivateAgent() external",
    "function getAgent(address _agent) external view returns (tuple(address agentAddress, string metadataURI, string capabilities, string endpoint, uint256 stakeAmount, uint256 reputationIndex, bool isActive, uint256 registeredAt))",
    "function getAgentCount() external view returns (uint256)",
    "function getAgentByIndex(uint256 _index) external view returns (address)",
    "function isAgentActive(address _agent) external view returns (bool)",
    "function MINIMUM_STAKE() external view returns (uint256)",
    "event AgentRegistered(address indexed agent, string metadataURI, string capabilities, uint256 stake, uint256 timestamp)",
    "event AgentUpdated(address indexed agent, string metadataURI, string capabilities, uint256 timestamp)",
    "event StakeDeposited(address indexed agent, uint256 amount, uint256 newTotal)",
    "event AgentDeactivated(address indexed agent, uint256 timestamp)",
] as const;

// AgentEscrow Contract ABI
// Maps to: contract/src/AgentEscrow.sol
export const AgentEscrowABI = [
    "function createJob(address _worker, uint256 _deadline) external payable returns (uint256)",
    "function acceptJob(uint256 _jobId) external",
    "function submitResult(uint256 _jobId, bytes32 _outputHash, string memory _proofRef) external",
    "function approveAndRelease(uint256 _jobId) external",
    "function rejectAndSlash(uint256 _jobId, uint256 _slashAmount) external",
    "function cancelJob(uint256 _jobId) external",
    "function getJob(uint256 _jobId) external view returns (tuple(uint256 jobId, address master, address worker, uint256 price, uint8 state, bytes32 outputHash, string proofRef, uint256 createdAt, uint256 deadline, bool fundsReleased))",
    "function getJobsByMaster(address _master, uint256 _limit) external view returns (uint256[] memory)",
    "function getJobsByWorker(address _worker, uint256 _limit) external view returns (uint256[] memory)",
    "function jobCounter() external view returns (uint256)",
    "function PLATFORM_FEE_PERCENTAGE() external view returns (uint256)",
    "event JobCreated(uint256 indexed jobId, address indexed master, address indexed worker, uint256 price, uint256 deadline, uint256 timestamp)",
    "event JobAccepted(uint256 indexed jobId, address indexed worker, uint256 timestamp)",
    "event ResultSubmitted(uint256 indexed jobId, bytes32 outputHash, string proofRef, uint256 timestamp)",
    "event JobApproved(uint256 indexed jobId, address indexed master, address indexed worker, uint256 payment, uint256 timestamp)",
    "event JobSlashed(uint256 indexed jobId, address indexed worker, uint256 slashAmount, uint256 timestamp)",
    "event JobCancelled(uint256 indexed jobId, uint256 timestamp)",
] as const;

// ReputationManager Contract ABI
// Maps to: contract/src/ReputationManager.sol
export const ReputationManagerABI = [
    "function getReputation(address _agent) external view returns (tuple(uint256 score, uint256 completedJobs, uint256 failedJobs, uint256 totalEarned, uint256 slashCount, uint256 lastUpdateTime))",
    "function getReputationScore(address _agent) external view returns (uint256)",
    "function getTrustScore(address _agent) external view returns (uint256)",
    "function getAgentStats(address _agent) external view returns (uint256 successRate, uint256 totalJobs, uint256 trustScore)",
    "event ReputationUpdated(address indexed agent, uint256 newScore, uint256 timestamp)",
    "event StakeSlashed(address indexed agent, uint256 amount, uint256 timestamp)",
    "event JobCompleted(address indexed agent, uint256 timestamp)",
    "event JobFailed(address indexed agent, uint256 timestamp)",
] as const;
