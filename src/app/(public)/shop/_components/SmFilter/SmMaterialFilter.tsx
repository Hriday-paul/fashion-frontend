"use client"
import { MaterialOptions } from "../MaterialSelect"

export default function SmMaterialFilter({ categoryId }: { categoryId?: string }) {
    return <MaterialOptions categoryId={categoryId} />
}
