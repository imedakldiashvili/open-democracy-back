import { serviceCreateElection, serviceProcessElection } from "../../modules/elections/services"

export const jobServiceCreateElection = async (templateId: number) => {
    try {
        return await serviceCreateElection(templateId)
    } catch (error) {
        console.log("[jobServiceCreateElection] error", error)
        return { status: 0, message: "job_create_election_failed" }
    }
}

export const jobServiceProcessElection = async () => {
    try {
        return await serviceProcessElection()
    } catch (error) {
        console.log("[jobServiceProcessElection] error", error)
        return { status: 0, message: "job_process_election_failed" }
    }
}
